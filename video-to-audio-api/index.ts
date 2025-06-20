import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

interface Job {
  progress: number;
  status: "processing" | "done" | "failed";
  filename: string;
  error: string | null;
}

const app = express();
app.use(cors());
app.use(express.json());

const AUDIO_FOLDER = path.join(__dirname, "audio");
if (!fs.existsSync(AUDIO_FOLDER)) fs.mkdirSync(AUDIO_FOLDER);

// TODO: may consider using Redis to store statuses
const JOBS: Record<string, Job> = {};

app.get("/health", (req: Request, res: Response) => {
  res.send("Healthy!");
  return;
});

app.post("/extract-audio", (req: Request, res: Response) => {
  const url: string | undefined = req.body.url;
  if (!url) {
    res.status(400).json({ error: "No URL provided." });
    return;
  }

  const jobId = uuidv4();
  const outFile = `audio-${jobId}.mp3`;
  const outPath = path.join(AUDIO_FOLDER, outFile);

  // Initialize job record
  JOBS[jobId] = {
    progress: 0,
    status: "processing",
    filename: outFile,
    error: null,
  };

  // Spawn yt-dlp process
  const yt = spawn("yt-dlp", [
    "-x",
    "--audio-format",
    "mp3",
    "-o",
    outPath,
    "--console-title",
    url,
  ]);

  yt.stderr.on("data", (data: Buffer) => {
    const text = data.toString();
    // [download]   5.4% ... pattern
    const m = text.match(/\[download\]\s+(\d+(?:\.\d+)?)%/);
    if (m && JOBS[jobId]) {
      JOBS[jobId].progress = Number(m[1]);
    }
  });

  yt.on("close", (code: number) => {
    if (JOBS[jobId]) {
      if (code === 0) {
        JOBS[jobId].progress = 100;
        JOBS[jobId].status = "done";
      } else {
        JOBS[jobId].status = "failed";
        JOBS[jobId].error = "yt-dlp exited with code " + code;
      }
    }
  });

  res.json({ success: true, jobId });
  return;
});

app.get("/progress/:jobId", (req: Request, res: Response) => {
  const { jobId } = req.params;
  if (!jobId) {
    res.status(400).json({ error: "Bad request" });
    return;
  }

  const job = JOBS[jobId];
  if (!job) {
    res.status(404).json({ error: "No such job" });
    return;
  }
  res.json(job);
  return;
});

app.get("/audio/:filename", (req: Request, res: Response) => {
  const { filename } = req.params;
  if (!filename) {
    res.status(400).json({ error: "Bad request" });
    return;
  }

  const filePath = path.join(AUDIO_FOLDER, filename);

  if (!fs.existsSync(filePath)) {
    res.status(404).send("Not found");
    return;
  }
  res.download(filePath);
  return;
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
