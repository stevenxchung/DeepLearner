import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
} from "react";
import {
  JobType,
  JobStatus,
  type MediaJob,
  type JobPollingTimeMap,
  type JobQueuedResponse,
} from "../types";
import { useFileContext } from "./FileContext";
import {
  cleanup,
  MEDIA_API_URL,
  pollJobStatus,
  putJob,
} from "../utils/mediaJobHelpers";

type JobContextType = {
  jobMap: Map<string, MediaJob>;
  setJobMap: React.Dispatch<React.SetStateAction<Map<string, MediaJob>>>;
  apiError: string | null;
  startMediaJob: (
    url: string,
    jobType: JobType,
    setUrl: React.Dispatch<React.SetStateAction<string>>
  ) => Promise<void>;
};

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [jobMap, setJobMap] = useState<Map<string, MediaJob>>(new Map());
  const [apiError, setApiError] = useState<string | null>(null);
  const { refreshFiles } = useFileContext();

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
        ? `${MEDIA_API_URL}/audio`
        : `${MEDIA_API_URL}/text`;

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
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToFetch, timestamp }),
      });

      const data: JobQueuedResponse = await response.json();
      if (!data.jobId) {
        setApiError(data.error || "Unknown error");
        return;
      }

      initialJob.id = data.jobId;
      putJob(initialJob, setJobMap);
      pollJobStatus(
        data.jobId,
        pollTimeouts,
        setJobMap,
        setApiError,
        refreshFiles
      );
    } catch {
      setApiError("Failed to connect to server.");
      cleanup(pollTimeouts, initialJobId);
    }
  };

  useEffect(() => () => cleanup(pollTimeouts), []); // Global cleanup on *app* unmount

  return (
    <JobContext.Provider
      value={{
        jobMap,
        setJobMap,
        apiError,
        startMediaJob,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => {
  const ctx = useContext(JobContext);
  if (!ctx) throw new Error("useJobContext must be used within JobProvider");
  return ctx;
};
