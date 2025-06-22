import fs from "fs";
import path from "path";

export async function audioToText(audioPath: string): Promise<string> {
  const fileBuffer = fs.readFileSync(audioPath);
  // Use Blob instead of File for broadest compatibility
  const blob = new Blob([fileBuffer], { type: "audio/mpeg" });
  const form = new FormData();
  form.append("audio", blob, path.basename(audioPath));

  const response = await fetch(`${process.env.AUDIO_TO_TEXT}/transcribe`, {
    method: "POST",
    body: form,
  });

  if (!response.ok)
    throw new Error(`Transcription server error: ${response.status}`);

  // Tell TS response.json() returns "any"
  const data: any = await response.json();
  return data.transcript;
}
