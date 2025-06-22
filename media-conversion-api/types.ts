export const JobStatus = {
  QUEUED: "QUEUED",
  PROCESSING: "PROCESSING",
  DONE: "DONE",
  FAILED: "FAILED",
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
  audioFilename?: string;
  transcript?: string;
  error?: string | null;
}
