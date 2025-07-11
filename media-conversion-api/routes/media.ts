import express from "express";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { type MediaJob, JobStatus, JobType } from "../types";
import { addJob, deleteJob, getJob } from "../workers/media-job-worker";

const router = express.Router();

router.post("/audio", (req: Request, res: Response) => {
  const { url, timestamp } = req.body;
  if (!url) {
    res.status(400).json({ error: "No url provided." });
    return;
  }
  if (!timestamp) {
    res.status(400).json({ error: "No timestamp provided." });
    return;
  }

  const id = uuidv4();
  const job: MediaJob = {
    id: id,
    url,
    timestamp,
    progress: 0,
    status: JobStatus.QUEUED,
    jobType: JobType.VIDEO_TO_AUDIO,
  };
  addJob(job);

  res.json({ jobId: id });
  return;
});

router.post("/text", (req: Request, res: Response) => {
  const { url, timestamp } = req.body;
  if (!url) {
    res.status(400).json({ error: "No url provided." });
    return;
  }
  if (!timestamp) {
    res.status(400).json({ error: "No timestamp provided." });
    return;
  }

  const id = uuidv4();
  const job: MediaJob = {
    id,
    url,
    timestamp,
    progress: 0,
    status: JobStatus.QUEUED,
    jobType: JobType.VIDEO_TO_TEXT,
  };
  addJob(job);

  res.json({ jobId: id });
  return;
});

router.get("/progress/:id", (req: Request, res: Response) => {
  // Gets progress across all jobs: video to audio, audio to text, etc.
  const job = getJob(req.params.id ?? "");
  if (!job) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  if (job.status === JobStatus.DONE) {
    // Remove job when complete
    deleteJob(job.id);
  }

  res.json(job);
  return;
});

export default router;
