// src/hooks/useAudioJob.ts
import { useState, useRef, useEffect } from "react";
import type { AudioJob } from "../types";

const API_URL = import.meta.env.VITE_VIDEO_PROCESSOR_API_URL;

export function useAudioJob() {
  const [job, setJob] = useState<AudioJob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const poller = useRef<number | null>(null);

  const clearPolling = () => {
    if (poller.current) clearInterval(poller.current);
  };

  const startAudioJob = async (url: string) => {
    // Reset states when starting new job
    setJob(null);
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
      if (data.success && data.jobId) {
        setJob({
          id: data.jobId,
          progress: 0,
          status: "processing",
        });
        pollProgress(data.jobId);
      } else {
        setError(data.error || "Unknown error");
        setLoading(false);
      }
    } catch {
      setError("Failed to connect to backend.");
      setLoading(false);
    }
  };

  const pollProgress = (jobId: string) => {
    poller.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/progress/${jobId}`);
        const data: AudioJob = await res.json();
        setJob(data);
        if (data.status === "done" && data.filename) {
          setAudioFile(`${API_URL}/audio/${data.filename}`);
          setLoading(false);
          clearPolling();
        } else if (data.status === "failed") {
          setError(data.error || "Job failed");
          setLoading(false);
          clearPolling();
        }
      } catch {
        setError("Polling failed");
        setLoading(false);
        clearPolling();
      }
    }, 2000);
  };

  // Optional: clean up polling on unmount
  useEffect(() => () => clearPolling(), []);

  return {
    job,
    loading,
    audioFile,
    error,
    startAudioJob,
  };
}
