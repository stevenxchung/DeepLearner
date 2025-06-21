// src/hooks/useAudioJob.ts
import { useState } from "react";
import { JobStatus } from "../types";

const API_URL = import.meta.env.VITE_VIDEO_PROCESSOR_API_URL;

export function useAudioJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<string | null>(null);

  const startAudioJob = async (url: string) => {
    // Reset states when starting new job
    setLoading(true);
    setError(null);
    setAudioFile(null);

    try {
      const res = await fetch(`${API_URL}/extract-audio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!data.job) {
        setError(data.error || "Unknown error");
        setLoading(false);
        return {
          loading,
          audioFile,
          error,
          startAudioJob,
        };
      }

      const job = data.job;
      switch (job.status) {
        case JobStatus.DONE:
          setAudioFile(`${API_URL}/audio/${job.filename}`);
          setLoading(false);
          break;
        case JobStatus.FAILED:
          setError(data.error || "Unknown error");
          setLoading(false);
          break;
        default:
          setLoading(true);
          break;
      }
    } catch {
      setError("Failed to connect to server.");
      setLoading(false);
    }
  };

  return {
    loading,
    audioFile,
    error,
    startAudioJob,
  };
}
