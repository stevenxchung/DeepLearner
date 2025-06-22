import { useState, useRef } from "react";
import { JobStatus } from "../types";

const API_URL = import.meta.env.VITE_MEDIA_PROCESSOR_API_URL;

export function useVideoToAudioJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<string | null>(null);

  // Reference to current timeout so we can clear on unmount or new job
  const pollTimeout = useRef<number | null>(null);

  // Clean up polling if component unmounts or a new job is started
  const cleanup = () => {
    if (pollTimeout.current) clearTimeout(pollTimeout.current);
    pollTimeout.current = null;
  };

  const pollJobStatus = async (jobId: string) => {
    try {
      const res = await fetch(`${API_URL}/job/${jobId}`);
      const job = await res.json();

      if (job.status === JobStatus.DONE) {
        setAudioFile(`${API_URL}/audio/${job.audioFilename}`);
        setLoading(false);
        cleanup();
        return;
      }
      if (job.status === JobStatus.FAILED) {
        setError(job.error || "Audio extraction failed.");
        setLoading(false);
        cleanup();
        return;
      }
      // Still processing, poll again in 2 seconds
      pollTimeout.current = setTimeout(() => pollJobStatus(jobId), 2000);
    } catch (e) {
      setError("Failed to connect to server.");
      setLoading(false);
      cleanup();
    }
  };

  const startVideoToAudioJob = async (url: string) => {
    // Reset states on new job
    setLoading(true);
    setError(null);
    setAudioFile(null);
    cleanup();

    try {
      const res = await fetch(`${API_URL}/video-to-audio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!data.jobId) {
        setError(data.error || "Unknown error");
        setLoading(false);
        return;
      }

      pollJobStatus(data.jobId);
    } catch {
      setError("Failed to connect to server.");
      setLoading(false);
      cleanup();
    }
  };

  return {
    loading,
    audioFile,
    error,
    startVideoToAudioJob,
  };
}
