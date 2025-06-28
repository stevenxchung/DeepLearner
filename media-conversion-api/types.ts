export const JobStatus = {
  DONE: "DONE",
  FAILED: "FAILED",
  NOT_FOUND: "NOT_FOUND",
  PROCESSING: "PROCESSING",
  QUEUED: "QUEUED",
} as const;

export const JobType = {
  VIDEO_TO_AUDIO: "VIDEO_TO_AUDIO",
  VIDEO_TO_TEXT: "VIDEO_TO_TEXT",
} as const;

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];
export type JobType = (typeof JobType)[keyof typeof JobType];

export interface MediaJob {
  id: string;
  url: string;
  progress: number;
  status: JobStatus;
  jobType: JobType;
  timestamp: string; // ISO 8601 Date string (from UI)
  audioFilename?: string;
  textFilename?: string;
  error?: string | null;
}

export interface TranscriptionStatusResponse {
  job_id: string;
  progress: number;
  status: JobStatus;
  filename?: string;
  reason?: string;
}

export interface AudioToTextResponse {
  status: JobStatus;
  filename?: string;
  error?: string;
}

export interface FileData {
  name: string;
  size: number; // In bytes
  created: string;
}
