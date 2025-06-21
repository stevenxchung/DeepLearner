import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { JobStatus, type AudioJob } from "./types";

const app = express();
app.use(cors());
app.use(express.json());

const AUDIO_FOLDER = path.join(__dirname, "audio");
if (!fs.existsSync(AUDIO_FOLDER)) fs.mkdirSync(AUDIO_FOLDER);

app.get("/health", (req: Request, res: Response) => {
  res.send("Healthy!");
  return;
});

app.post("/extract-audio", async (req: Request, res: Response) => {
  const url: string | undefined = req.body.url;
  if (!url) {
    res.status(400).json({ error: "No URL provided." });
    return;
  }

  const jobId = uuidv4();
  const filename = `audio-${jobId}.mp3`;
  const outPath = path.join(AUDIO_FOLDER, filename);

  const job: AudioJob = {
    id: jobId,
    progress: 0,
    status: JobStatus.PROCESSING,
    filename,
    error: null,
  };

  const yt = spawn("yt-dlp", [
    "-x",
    "--audio-format",
    "mp3",
    "-o",
    outPath,
    "--newline",
    url,
  ]);

  yt.on("close", (code: number) => {
    if (code === 0) {
      job.progress = 100;
      job.status = JobStatus.DONE;
      return res.json({ job });
    } else {
      job.status = JobStatus.FAILED;
      job.error = "yt-dlp exited with code " + code;
      res.status(500).json({ error: job.error });
      return;
    }
  });

  yt.on("error", (err) => {
    job.status = JobStatus.FAILED;
    job.error = "yt-dlp process error: " + err.message;
    // .end() in case error and close both fire
    res.status(500).json({ error: job.error });
    return;
  });
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
