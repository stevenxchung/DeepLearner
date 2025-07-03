import { JobStatus, type JobPollingTimeMap, type MediaJob } from "../types";

export const MEDIA_API_URL = `${
  import.meta.env.VITE_MEDIA_PROCESSOR_API_URL
}/media`;

export function cleanup(
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

export function putJob(
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

export async function pollJobStatus(
  jobId: string,
  pollTimeouts: React.RefObject<JobPollingTimeMap>,
  setJobMap: React.Dispatch<React.SetStateAction<Map<string, MediaJob>>>,
  setApiError: React.Dispatch<React.SetStateAction<string | null>>,
  refreshFiles: () => void
) {
  try {
    const response = await fetch(`${MEDIA_API_URL}/progress/${jobId}`);
    const job: MediaJob = await response.json();
    putJob(job, setJobMap);

    if (job.status === JobStatus.DONE) {
      refreshFiles();
      cleanup(pollTimeouts, jobId);
      return;
    } else if (job.status === JobStatus.FAILED) {
      cleanup(pollTimeouts, jobId);
      return;
    }

    pollTimeouts.current[jobId] = window.setTimeout(
      () =>
        pollJobStatus(
          jobId,
          pollTimeouts,
          setJobMap,
          setApiError,
          refreshFiles
        ),
      1000 * 3
    );
  } catch (e) {
    setApiError("Failed to connect to server.");
    cleanup(pollTimeouts, jobId);
  }
}
