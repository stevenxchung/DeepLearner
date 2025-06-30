import { useState, useRef, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import {
  JobStatus,
  JobType,
  type JobPollingTimeMap,
  type JobQueuedResponse,
  type MediaJob,
} from "../types";

const API_URL = `${import.meta.env.VITE_MEDIA_PROCESSOR_API_URL}/media`;

function cleanup(
  pollTimeouts: React.RefObject<JobPollingTimeMap>,
  jobId?: string
) {
  if (jobId && pollTimeouts.current[jobId]) {
    // Clears timers based on job ID
    clearTimeout(pollTimeouts.current[jobId]);
    delete pollTimeouts.current[jobId];
  } else if (!jobId) {
    // Clean up all (on unmount)
    Object.values(pollTimeouts.current).forEach(clearTimeout);
    pollTimeouts.current = {};
  }
}

async function pollJobStatus(
  jobId: string,
  pollTimeouts: React.RefObject<JobPollingTimeMap>,
  setJobMap: React.Dispatch<React.SetStateAction<Map<string, MediaJob>>>,
  setApiError: React.Dispatch<React.SetStateAction<string | null>>
) {
  try {
    const res = await fetch(`${API_URL}/progress/${jobId}`);
    const job: MediaJob = await res.json();
    putJob(job, setJobMap);

    if (job.status === JobStatus.DONE || job.status === JobStatus.FAILED) {
      cleanup(pollTimeouts, jobId);
      return;
    }
    pollTimeouts.current[jobId] = window.setTimeout(
      () => pollJobStatus(jobId, pollTimeouts, setJobMap, setApiError),
      1000 * 3
    );
  } catch (e) {
    setApiError("Failed to connect to server.");
    cleanup(pollTimeouts, jobId);
  }
}

function putJob(
  job: MediaJob,
  setJobMap: React.Dispatch<React.SetStateAction<Map<string, MediaJob>>>
) {
  // Update job by ID
  setJobMap((jobMap) => {
    const newMap = new Map(jobMap);
    newMap.set(job.id, job);
    return newMap;
  });
}

export function useMediaJob() {
  const { setJobMap } = useAppContext();
  const [apiError, setApiError] = useState<string | null>(null);

  const pollTimeouts = useRef<JobPollingTimeMap>({});

  const startMediaJob = async (
    url: string,
    jobType: JobType,
    setUrl: React.Dispatch<React.SetStateAction<string>>
  ) => {
    // Reset states on new job
    setApiError(null);

    const apiUrl =
      jobType === JobType.VIDEO_TO_AUDIO
        ? `${API_URL}/video-to-audio`
        : `${API_URL}/video-to-text`;

    // Clear user input
    const urlToFetch = url;
    setUrl("");

    const initialJobId = "Initialized";
    const timestamp = new Date().toISOString();
    const initialJob: MediaJob = {
      id: initialJobId,
      timestamp,
      url: urlToFetch,
      progress: 0,
      status: JobStatus.QUEUED,
      jobType,
    };

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToFetch, timestamp }),
      });

      const data: JobQueuedResponse = await res.json();
      if (!data.jobId) {
        setApiError(data.error || "Unknown error");
        return;
      }

      initialJob.id = data.jobId;
      putJob(initialJob, setJobMap);
      pollJobStatus(data.jobId, pollTimeouts, setJobMap, setApiError);
    } catch {
      setApiError("Failed to connect to server.");
      cleanup(pollTimeouts, initialJobId);
    }
  };

  // Clean up ALL timers on unmount
  useEffect(() => () => cleanup(pollTimeouts), []);

  return {
    apiError,
    startMediaJob,
  };
}
