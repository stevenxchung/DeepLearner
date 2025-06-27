import os
import logging
import torch
import uvicorn


from enum import Enum
from time import perf_counter
from fastapi import BackgroundTasks, FastAPI
from pydantic import BaseModel
from faster_whisper import WhisperModel
from mutagen import File as MutagenFile
from typing import Dict, Optional


logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI()
# Adjust model initial conditions here
model = WhisperModel("tiny", device="cuda", compute_type="float16")

API_DIR = os.path.dirname(__file__)
ROOT_DIR = os.path.abspath(os.path.join(API_DIR, ".."))
TEXT_DIR = os.path.join(ROOT_DIR, "_text")
os.makedirs(TEXT_DIR, exist_ok=True)


class JobStatus(str, Enum):
    DONE = "DONE"
    FAILED = "FAILED"
    NOT_FOUND = "NOT_FOUND"
    PROCESSING = "PROCESSING"
    QUEUED = "QUEUED"


class TranscriptionRequest(BaseModel):
    job_id: str
    filename: str


class TranscriptionStatus(BaseModel):
    job_id: str
    progress: float
    status: JobStatus
    filename: Optional[str] = None
    reason: Optional[str] = None


# TODO: may switch to persistent storage in future if necessary
job_cache: Dict[str, TranscriptionStatus] = {}


def _get_audio_duration(filepath):
    audio = MutagenFile(filepath)
    if audio and audio.info:
        return audio.info.length  # seconds as float
    return None


def _transcribe(req: TranscriptionRequest):
    filepath = f"../_audio/{req.filename}"
    job_id = req.job_id
    progress = 0.0

    if not os.path.isfile(filepath):
        job_cache[job_id] = TranscriptionStatus(
            job_id=job_id,
            progress=0.0,
            status=JobStatus.FAILED,
            reason=f"File not found: {filepath}",
        )
        return

    total_duration = _get_audio_duration(filepath)
    if not total_duration:
        job_cache[job_id] = TranscriptionStatus(
            job_id=job_id,
            progress=progress,
            status=JobStatus.FAILED,
            reason="Could not determine audio duration",
        )
        return

    base_name = os.path.splitext(os.path.basename(filepath))[0]
    text_filename = f"{base_name}.txt"
    transcript_path = os.path.join(TEXT_DIR, text_filename)

    try:
        logger.info(f"Starting transcription for: {filepath}")
        job_cache[job_id] = TranscriptionStatus(
            job_id=job_id, progress=0.01, status=JobStatus.PROCESSING
        )

        t0 = perf_counter()
        with open(transcript_path, "w", encoding="utf-8") as f:
            processed = 0.0
            segments, _ = model.transcribe(filepath)
            for seg in segments:
                f.write(seg.text)
                processed = float(seg.end)
                progress = min(0.99, processed / total_duration)
                job_cache[job_id] = TranscriptionStatus(
                    job_id=job_id,
                    progress=progress,
                    status=JobStatus.PROCESSING,
                    filename=text_filename,
                )
        t1 = perf_counter()
        logger.info(f"Transcription complete for: {filepath}")
        logger.info(f"Transcription runtime {t1 - t0:.2f}s")
        logger.info(f"Transcript successfully written to: {transcript_path}")

        job_cache[job_id] = TranscriptionStatus(
            job_id=job_id,
            progress=1.0,
            status=JobStatus.DONE,
            filename=text_filename,
        )
        return
    except Exception as e:
        logger.exception(f"Transcription failed for {filepath}")
        job_cache[job_id] = TranscriptionStatus(
            job_id=job_id,
            progress=0.0,
            status=JobStatus.FAILED,
            reason=str(e),
        )
        return


@app.get("/health")
def health_check():
    return "Healthy!"


@app.post("/api/transcribe", response_model=TranscriptionStatus)
def start_transcription(req: TranscriptionRequest, bg_tasks: BackgroundTasks):
    job_id = req.job_id
    job_cache[job_id] = TranscriptionStatus(
        job_id=job_id, progress=0.0, status=JobStatus.QUEUED
    )
    bg_tasks.add_task(_transcribe, req)
    return job_cache[job_id]


@app.get("/api/transcribe/status/{job_id}", response_model=TranscriptionStatus)
def get_status(job_id: str):
    return job_cache.get(
        job_id,
        TranscriptionStatus(
            job_id=job_id,
            progress=0.0,
            status=JobStatus.NOT_FOUND,
            reason="Job not found.",
        ),
    )


if __name__ == "__main__":
    logger.info(f"Torch version Cuda: {torch.version.cuda}")
    logger.info(f"CUDA available? {torch.cuda.is_available()}")
    uvicorn.run("main:app", host="127.0.0.1", port=6000, reload=False)
