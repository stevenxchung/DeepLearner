import { spawn } from "child_process";
import path from "path";
import { JobType, type MediaJob } from "../types";

export const AUDIO_DIR = path.resolve(__dirname, "../../_audio");

export async function getYoutubeTitle(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const yt = spawn("yt-dlp", ["--print", "title", url]);
    let result = "";
    yt.stdout.on("data", (d) => {
      result += d.toString();
    });
    yt.on("close", (code) => {
      if (code === 0) resolve(result.trim());
      else reject(new Error(`yt-dlp exited with code ${code}`));
    });
    yt.on("error", reject);
  });
}

export function formatTitle(title: string): string {
  let slug = title.toLowerCase();
  // Replace any non-alphanumeric (except whitespace) with a space
  slug = slug.replace(/[^a-z0-9\s]+/g, " ");
  // Collapse multiple whitespace to a single space
  slug = slug.replace(/\s+/g, " ").trim();
  let words = slug.split(" ").slice(0, 5);
  slug = words.join("-");

  return slug;
}

export function videoToAudio(
  url: string,
  outPath: string,
  onProgress?: (percentage: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const yt = spawn("yt-dlp", [
      "-x",
      "--audio-format",
      "mp3",
      "-o",
      outPath,
      url,
    ]);

    yt.stdout.on("data", (data) => {
      const line = data.toString();
      // yt-dlp shows progress lines like: [download]   3.1% of ~11.73MiB ...
      const match = line.match(/\[download\]\s+(\d+\.\d+)%/);
      if (match) {
        const percentComplete = parseFloat(match[1]) / 100;
        // Log just when progress percentage is captured
        console.info(
          `[yt-dlp] Download progress: ${(percentComplete * 100).toFixed(1)}%`
        );

        if (onProgress) onProgress(percentComplete);
      }
    });

    yt.on("close", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`yt-dlp exited with code ${code}`))
    );
    yt.on("error", reject);
  });
}

export async function runVideoToAudioWithFallback(
  job: MediaJob,
  outPath: string
) {
  let fallbackProgress = 0;
  const startTime = Date.now();

  // Start fallback progress timer (0 to 1 over 10 seconds)
  const fallbackInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000; // seconds
    fallbackProgress = Math.min(elapsed / 10, 1);
    job.progress =
      job.jobType === JobType.VIDEO_TO_TEXT
        ? fallbackProgress * 50
        : fallbackProgress * 100;
  }, 1000 * 0.5); // Update fallback progress every 500ms

  await videoToAudio(job.url, outPath, (percentComplete: number) => {
    job.progress = Math.max(percentComplete, job.progress);
  });

  clearInterval(fallbackInterval); // Cleanup
}
