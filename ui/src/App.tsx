import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { useMediaJob } from "./hooks/useMediaJob";
import { ActionButton } from "./components/ActionButton";
import { ReactiveInput } from "./components/ReactiveInput";
import { JobTable } from "./components/JobTable";
import { JobType, type MediaJob } from "./types";

function App() {
  const [url, setUrl] = useState("");
  const [jobs, setJobs] = useState<MediaJob[]>([]);

  const { apiError, startMediaJob } = useMediaJob({
    onJobQueued: (job) => {
      setJobs((prev) => [job, ...prev]);
    },
    onJobUpdated: (updatedJob) => {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === updatedJob.id ? { ...job, ...updatedJob } : job
        )
      );
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col w-full max-w-3xl mx-auto py-8 gap-4">
        <div className="py-16">
          <div className="flex flex-row gap-8 justify-center items-center">
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo h-24" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo h-24" alt="React logo" />
            </a>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-700 mb-4">
          Media Converter
        </h1>

        <ReactiveInput
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste URL here"
          error={!!apiError}
          autoComplete="off"
        />

        <div className="flex items-center gap-2 mb-6">
          <ActionButton
            text="⚡🔉"
            hint="To audio"
            color="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300"
            onClick={() => startMediaJob(url, JobType.VIDEO_TO_AUDIO)}
          />

          <ActionButton
            text="⚡📃"
            hint="To text"
            color="bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300"
            onClick={() => startMediaJob(url, JobType.VIDEO_TO_TEXT)}
          />
          {apiError && (
            <span className="text-red-600 text-sm ml-3">{apiError}</span>
          )}
        </div>

        <JobTable jobs={jobs} />
      </div>
    </div>
  );
}

export default App;
