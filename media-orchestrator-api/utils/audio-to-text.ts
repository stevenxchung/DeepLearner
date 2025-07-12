import path from "path";
import {
  JobStatus,
  type AudioToTextResponse,
  type MediaJob,
  type TranscriptionStatusResponse,
} from "../types";

export const TEXT_DIR = path.resolve(__dirname, "../../_text");
const TRANSCRIPTION_API = `${process.env.AUDIO_TO_TEXT_API}/api`;

export async function audioToText(
  job: MediaJob,
  onProgress?: (percentage: number) => void
): Promise<AudioToTextResponse> {
  const response = await fetch(`${TRANSCRIPTION_API}/transcription`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_id: job.id, filename: job.audioFilename }),
  });

  let startTranscriptionData: TranscriptionStatusResponse;
  try {
    startTranscriptionData =
      (await response.json()) as TranscriptionStatusResponse;
  } catch (e) {
    return {
      status: JobStatus.FAILED,
      error: "Invalid JSON from transcription service.",
    };
  }

  if (!response.ok) {
    return {
      status: JobStatus.FAILED,
      error: startTranscriptionData?.reason || `HTTP ${response.status}`,
    };
  }

  if (!job.id) {
    return {
      status: JobStatus.FAILED,
      error: "No job id returned from transcription service.",
    };
  }

  // Poll for progress
  let attempts = 0;
  let lastProgress = 0;

  while (true) {
    await new Promise((res) => setTimeout(res, 1000 * 2)); // Poll every 2 seconds
    attempts++;

    const statusRes = await fetch(
      `${TRANSCRIPTION_API}/transcription/status/${job.id}`
    );
    let statusData: TranscriptionStatusResponse | null = null;
    try {
      statusData = (await statusRes.json()) as TranscriptionStatusResponse;
    } catch (e) {
      // Ignore JSON decode errors for polling, try again
      continue;
    }

    // Progress callback
    if (
      onProgress &&
      typeof statusData?.progress === "number" &&
      statusData.progress !== lastProgress
    ) {
      lastProgress = statusData.progress;
      onProgress(lastProgress);
    }

    switch (statusData?.status) {
      case JobStatus.DONE:
        return {
          status: JobStatus.DONE,
          filename: statusData.filename,
        };
      case JobStatus.FAILED:
        return {
          status: JobStatus.FAILED,
          error: statusData.reason,
        };
      default:
        break;
    }
  }
}
