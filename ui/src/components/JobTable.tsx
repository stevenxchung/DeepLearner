import { JobStatus, JobType, type MediaJob } from "../types";

interface JobTableProps {
  jobs: MediaJob[];
}

// Helpers for rendering
function formatStatus(status: JobStatus, error?: string | null | undefined) {
  let color =
    status === JobStatus.DONE
      ? "text-green-600"
      : status === JobStatus.FAILED
      ? "text-red-600"
      : "text-gray-600";

  return (
    <span className={`font-semibold ${color}`}>
      {status}
      {error && <div className="text-xs text-red-500">{error}</div>}
    </span>
  );
}

function formatProgress(status: JobStatus, progress?: number) {
  if (status === JobStatus.DONE) return "100%";
  if (progress != null) return `${progress.toFixed(1)}%`;
  return "-";
}

const DownloadLink = ({ job }: { job: MediaJob }) => {
  if (job.jobType === JobType.VIDEO_TO_AUDIO && job.audioFilename) {
    return (
      <a
        href={`/_audio/${job.audioFilename}`}
        download
        className="text-blue-600 underline"
      >
        {job.audioFilename}
      </a>
    );
  }
  if (job.jobType === JobType.VIDEO_TO_TEXT && job.textFilename) {
    return (
      <a
        href={`/_text/${job.textFilename}`}
        download
        className="text-blue-600 underline"
      >
        {job.textFilename}
      </a>
    );
  }
  if (job.status !== JobStatus.FAILED) {
    return (
      <svg
        className="animate-spin h-5 w-5 text-black inline"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-30"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-80"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    );
  }
  return <>-</>;
};

const JobRow = ({ job }: { job: MediaJob }) => {
  return (
    <tr className="even:bg-gray-50 odd:bg-white border-b" key={job.id}>
      <td className="py-2 px-4">{new Date(job.timestamp).toLocaleString()}</td>
      <td className="py-2 px-4">{job.jobType.replace(/_/g, " ")}</td>
      <td className="py-2 px-4">{formatStatus(job.status, job.error)}</td>
      <td className="py-2 px-4">{formatProgress(job.status, job.progress)}</td>
      <td className="py-2 px-4">
        <DownloadLink job={job} />
      </td>
    </tr>
  );
};

export const JobTable: React.FC<JobTableProps> = ({ jobs }) => {
  return (
    <div className="overflow-x-auto shadow rounded bg-white">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-emerald-200 text-gray-700">
            <th className="py-2 px-4 text-left">Timestamp</th>
            <th className="py-2 px-4 text-left">Job Type</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Progress</th>
            <th className="py-2 px-4 text-left">Filename</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length === 0 ? (
            <tr>
              <td className="py-4 px-4 text-center text-gray-500" colSpan={5}>
                No jobs yet.
              </td>
            </tr>
          ) : (
            jobs.map((job) => <JobRow key={job.id} job={job} />)
          )}
        </tbody>
      </table>
    </div>
  );
};
