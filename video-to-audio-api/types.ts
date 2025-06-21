export const JobStatus = {
  PROCESSING: "PROCESSING",
  DONE: "DONE",
  FAILED: "FAILED",
} as const;

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];

export interface AudioJob {
  id: string;
  progress: number;
  status: JobStatus;
  filename?: string;
  error?: string | null;
}
