import { spawn } from "child_process";

export function videoToAudio(url: string, outPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const yt = spawn("yt-dlp", [
      "-x",
      "--audio-format",
      "mp3",
      "-o",
      outPath,
      "--newline",
      url,
    ]);
    yt.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`yt-dlp failed: ${code}`))
    );
    yt.on("error", reject);
  });
}
