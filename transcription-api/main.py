import os
import logging
import uvicorn

from enum import Enum
from typing import Optional
from time import perf_counter
from fastapi import FastAPI
from pydantic import BaseModel
from faster_whisper import WhisperModel

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI()
# Adjust model initial conditions here
model = WhisperModel("tiny", device="cuda", compute_type="float16")

API_DIR = os.path.dirname(__file__)
ROOT_DIR = os.path.abspath(os.path.join(API_DIR, ".."))
TEXT_DIR = os.path.join(ROOT_DIR, "text")
os.makedirs(TEXT_DIR, exist_ok=True)


class JobStatus(str, Enum):
    SUCCESS = "SUCCESS"
    FAILURE = "FAILURE"


class TranscriptionRequest(BaseModel):
    filename: str


class TranscriptionResponse(BaseModel):
    status: JobStatus
    filename: Optional[str] = None
    reason: Optional[str] = None


@app.post("/transcribe", response_model=TranscriptionResponse)
def transcribe_path(req: TranscriptionRequest):
    filepath = f"../audio/{req.filename}"

    if not os.path.isfile(filepath):
        return {"status": JobStatus.FAILURE, "reason": f"File not found: {filepath}"}

    base_name = os.path.splitext(os.path.basename(filepath))[0]
    text_filename = f"{base_name}.txt"
    transcript_path = os.path.join(TEXT_DIR, text_filename)

    try:
        logger.info(f"Starting transcription for: {filepath}")
        t0 = perf_counter()
        segments, _ = model.transcribe(filepath)
        t1 = perf_counter()
        logger.info(f"Transcription initialized runtime {t1 - t0:.2f}s")

        t0 = perf_counter()
        with open(transcript_path, "w", encoding="utf-8") as f:
            for seg in segments:
                f.write(seg.text)
        t1 = perf_counter()
        logger.info(f"Transcription complete for: {filepath}")
        logger.info(f"Transcription initialized runtime {t1 - t0:.2f}s")

        logger.info(f"Transcript successfully written to: {transcript_path}")
        return {"status": JobStatus.SUCCESS, "filename": text_filename}
    except Exception as e:
        logger.exception(f"Transcription failed for {filepath}")
        return {"status": JobStatus.FAILURE, "reason": str(e)}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=6000, reload=False)
