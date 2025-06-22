import path from "path";
import { JobStatus, JobType, type MediaJob } from "../types";
import { videoToAudio } from "../utils/video-to-audio";
import { audioToText } from "../utils/audio-to-text";

const jobs = new Map<string, MediaJob>();
const jobQueue: string[] = [];
const AUDIO_FOLDER = path.resolve(__dirname, "../../audio");

export function addJob(job: MediaJob) {
  jobs.set(job.id, job);
  jobQueue.push(job.id);
}

export function getJob(id: string) {
  return jobs.get(id);
}

export function getAudioFolder() {
  return AUDIO_FOLDER;
}

export function startJobWorker() {
  const processJob = async () => {
    // Checks for jobs every 10 seconds if queue is empty
    if (jobQueue.length === 0) return setTimeout(processJob, 1000 * 10);
    const jobId = jobQueue.shift();
    if (!jobId) return setImmediate(processJob);
    const job = jobs.get(jobId);
    if (!job) return setImmediate(processJob);

    try {
      job.status = JobStatus.PROCESSING;
      job.progress = 10;

      const audioFile = `audio-${jobId}.mp3`;
      const outPath = path.join(AUDIO_FOLDER, audioFile);

      await videoToAudio(job.url, outPath);
      job.audioFilename = audioFile;
      job.progress = 50;

      // Only do transcription if requested
      if (job.jobType === JobType.VIDEO_TO_TEXT) {
        job.transcript = await audioToText(outPath);
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
