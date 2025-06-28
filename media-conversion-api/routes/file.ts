import path from "path";
import fs from "fs/promises";
import express from "express";
import type { Request, Response } from "express";
import type { FileData } from "../types";
import { TEXT_DIR } from "../utils/audio-to-text";
import { AUDIO_DIR } from "../utils/video-to-audio";

const router = express.Router();

async function _getFileData(dir: string): Promise<FileData[]> {
  const files = await fs.readdir(dir);
  return Promise.all(
    files.map(async (file) => {
      const stat = await fs.stat(`${dir}/${file}`);
      return {
        name: file,
        size: stat.size,
        created: stat.birthtime.toISOString(),
      };
    })
  );
}

router.get("/files", async (req: Request, res: Response) => {
  try {
    const [textData, audioData] = await Promise.all([
      _getFileData(TEXT_DIR),
      _getFileData(AUDIO_DIR),
    ]);
    res.json([...textData, ...audioData]);
  } catch (err) {
    res.status(500).json({ error: "Could not read files" });
  }
});

router.get("/:filename", async (req: Request, res: Response) => {
  const { filename } = req.params;
  if (!filename) {
    res.status(400).send("Bad request");
    return;
  }

  const filepath = path.join(TEXT_DIR, filename);
  try {
    const data = await fs.readFile(filepath, "utf-8");
    res.send(data);
    return;
  } catch (e) {
    res.status(404).send("Not found");
    return;
  }
});

router.delete("/:filename", async (req: Request, res: Response) => {
  const { filename } = req.params;
  if (!filename) {
    res.status(400).send("Bad request");
    return;
  }

  const filepath = path.join(TEXT_DIR, filename);
  await fs.unlink(filepath);
  res.send("Deleted");
  return;
});

export default router;
