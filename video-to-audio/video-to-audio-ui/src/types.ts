export type JobStatus = "processing" | "done" | "failed";

export interface AudioJob {
  id: string;
  progress: number;
  status: JobStatus;
  filename?: string;
  error?: string | null;
}
