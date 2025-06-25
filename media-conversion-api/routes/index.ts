import path from "path";
import fs from "fs";
import express from "express";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { type MediaJob, JobStatus, JobType } from "../types";
import {
  addJob,
  deleteJob,
  getAudioFolder,
  getJob,
  getTextFolder,
} from "../jobs";

const router = express.Router();

router.get("/health", (req: Request, res: Response) => {
  res.send("Healthy!");
  return;
});

router.post("/video-to-audio", (req: Request, res: Response) => {
  const url = req.body.url;
  if (!url) {
    res.status(400).json({ error: "No URL provided." });
    return;
  }

  const id = uuidv4();
  const job: MediaJob = {
    id: id,
    url,
    progress: 0,
    status: JobStatus.QUEUED,
    jobType: JobType.VIDEO_TO_AUDIO,
  };
  addJob(job);

  res.json({ jobId: id });
  return;
});

router.post("/video-to-text", (req: Request, res: Response) => {
  const url = req.body.url as string;
  if (!url) {
    res.status(400).json({ error: "No URL provided." });
    return;
  }

  const id = uuidv4();
  const job: MediaJob = {
    id,
    url,
    progress: 0,
    status: JobStatus.QUEUED,
    jobType: JobType.VIDEO_TO_TEXT,
  };
  addJob(job);

  res.json({ jobId: id });
  return;
});

router.get("/job/progress/:id", (req: Request, res: Response) => {
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

router.get("/audio/:filename", (req: Request, res: Response) => {
  const { filename } = req.params;
  if (!filename) {
    res.status(400).json({ error: "Bad request" });
    return;
  }

  const filePath = path.join(getAudioFolder(), filename);
  if (!fs.existsSync(filePath)) {
    res.status(404).send("Not found");
    return;
  }

  res.download(filePath);
  return;
});

router.get("/text/:filename", (req: Request, res: Response) => {
  const { filename } = req.params;
  if (!filename) {
    res.status(400).json({ error: "Bad request" });
    return;
  }

  const filePath = path.join(getTextFolder(), filename);
  if (!fs.existsSync(filePath)) {
    res.status(404).send("Not found");
    return;
  }

  res.download(filePath);
  return;
});

export default router;
