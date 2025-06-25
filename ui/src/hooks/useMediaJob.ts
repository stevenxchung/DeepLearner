import { useState, useRef } from "react";
import {
  JobStatus,
  JobType,
  type JobQueuedResponse,
  type MediaJob,
} from "../types";

const API_URL = import.meta.env.VITE_MEDIA_PROCESSOR_API_URL;

export function useMediaJob({
  onJobQueued,
  onJobUpdated,
}: {
  onJobQueued?: (job: MediaJob) => void;
  onJobUpdated?: (job: MediaJob) => void;
} = {}) {
  const [job, setJob] = useState<MediaJob | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Reference to current timeout so we can clear on unmount or new job
  const pollTimeout = useRef<number | null>(null);

  // Clean up polling if component unmounts or a new job is started
  const cleanup = () => {
    if (pollTimeout.current) clearTimeout(pollTimeout.current);
    pollTimeout.current = null;
  };

  const pollJobStatus = async (jobId: string) => {
    try {
      const res = await fetch(`${API_URL}/job/progress/${jobId}`);
      const job: MediaJob = await res.json();
      setJob(job);

      if (onJobUpdated) onJobUpdated(job);

      if (job.status === JobStatus.DONE) {
        cleanup();
        return;
      }
      if (job.status === JobStatus.FAILED) {
        cleanup();
        return;
      }

      // Still processing, poll again in 2 seconds
      pollTimeout.current = setTimeout(() => pollJobStatus(jobId), 1000 * 2);
    } catch (e) {
      setApiError("Failed to connect to server.");
      cleanup();
    }
  };

  const startMediaJob = async (url: string, jobType: JobType) => {
    // Reset states on new job
    setApiError(null);
    setJob(null);
    cleanup();

    const apiUrl =
      jobType === JobType.VIDEO_TO_AUDIO
        ? `${API_URL}/video-to-audio`
        : `${API_URL}/video-to-text`;

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data: JobQueuedResponse = await res.json();
      if (!data.jobId) {
        setApiError(data.error || "Unknown error");
        return;
      }

      const initialJob: MediaJob = {
        id: data.jobId,
        timestamp: new Date().toISOString(),
        url,
        progress: 0,
        status: JobStatus.QUEUED,
        jobType,
      };
      setJob(initialJob);
      if (onJobQueued) onJobQueued(initialJob);

      pollJobStatus(data.jobId);
    } catch {
      setApiError("Failed to connect to server.");
      cleanup();
    }
  };

  return {
    job,
    apiError,
    startMediaJob,
  };
}
