import path from "path";
import { JobStatus, JobType, type MediaJob } from "../types";
import {
  getYoutubeTitle,
  formatTitle,
  videoToAudio,
  AUDIO_DIR,
} from "../utils/video-to-audio";
import { audioToText } from "../utils/audio-to-text";

// Limited to 2^24 ~ 16M entries which is OK for this implementation
let jobCache = new Map<string, MediaJob>();
const jobQueue: string[] = [];

export function addJob(job: MediaJob) {
  jobCache.set(job.id, job);
  jobQueue.push(job.id);
}

export function getJob(id: string) {
  return jobCache.get(id);
}

export function deleteJob(id: string) {
  jobCache.delete(id);
}

export function startMediaJobWorker() {
  const processJob = async () => {
    // Checks for jobs every 10 seconds if queue is empty
    if (jobQueue.length === 0) return setTimeout(processJob, 1000 * 10);

    const jobId = jobQueue.shift();
    if (!jobId) return setImmediate(processJob);

    const job = jobCache.get(jobId);
    if (!job) return setImmediate(processJob);

    try {
      job.status = JobStatus.PROCESSING;
      job.progress = 10;

      const title = await getYoutubeTitle(job.url);
      const filename = formatTitle(title);
      const audioFile = `${filename}.mp3`;
      const outPath = path.join(AUDIO_DIR, `${filename}.mp3`);

      await videoToAudio(job.url, outPath, (percentComplete: number) => {
        // Update progress as necessary
        job.progress =
          job.jobType === JobType.VIDEO_TO_TEXT
            ? percentComplete * 50
            : percentComplete * 100;
      });
      job.audioFilename = audioFile;

      // Only do transcription if requested
      if (job.jobType === JobType.VIDEO_TO_TEXT) {
        const audioToTextResponse = await audioToText(
          job,
          (percentComplete: number) => {
            job.progress = 50 + percentComplete * 50;
          }
        );
        if (audioToTextResponse.status === JobStatus.FAILED)
          throw new Error(
            `Failed to transcribe audio. ${audioToTextResponse.error}`
          );

        job.textFilename = audioToTextResponse.filename;
      }

      job.progress = 100;
      job.status = JobStatus.DONE;
    } catch (err) {
      job.status = JobStatus.FAILED;
      job.error = err instanceof Error ? err.message : String(err);
    }
    setImmediate(processJob);
  };

  processJob();
}
