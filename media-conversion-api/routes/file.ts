import path from "path";
import fs from "fs/promises";
import express from "express";
import type { Request, Response } from "express";
import { TEXT_DIR } from "../utils/audio-to-text";

const router = express.Router();

router.get("/texts", async (req: Request, res: Response) => {
  const files = await fs.readdir(TEXT_DIR);
  res.json(files.filter((f) => f.endsWith(".txt")));
  return;
});

router.get("/text/:filename", async (req: Request, res: Response) => {
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

router.delete("/text/:filename", async (req: Request, res: Response) => {
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
