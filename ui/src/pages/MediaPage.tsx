import { useState } from "react";
import { ActionButton } from "../components/ActionButton";
import { ReactiveInput } from "../components/ReactiveInput";
import { JobTable } from "../components/JobTable";
import { JobType } from "../types";

import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import { useJobContext } from "../context/JobContext";

export const MediaPage: React.FC = () => {
  const [url, setUrl] = useState("");
  const { apiError, startMediaJob } = useJobContext();

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto py-8 gap-4">
      <div className="py-16">
        <div className="flex flex-row gap-8 justify-center items-center">
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo h-24" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img
              src={reactLogo}
              className="logo h-24"
              style={{
                animation: "spin 10s linear infinite",
                transformOrigin: "center",
              }}
              alt="React logo"
            />
          </a>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-700 mb-2">Media Converter</h1>
      <ReactiveInput
        styles={`border-[#E3E8F6] shadow ${
          !!apiError
            ? "border-red-500 focus:ring-2 focus:ring-red-300"
            : "border-gray-300 focus:ring-2 focus:ring-blue-300"
        }`}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste URL here"
        autoComplete="off"
      />
      <div className="flex items-center gap-2 mb-6">
        {/* <ActionButton
          text="⚡🔉"
          hint="To audio"
          styles="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
          disabled={!url}
          onClick={() => startMediaJob(url, JobType.VIDEO_TO_AUDIO, setUrl)}
        /> */}
        <ActionButton
          text="⚡📃"
          hint="To text"
          styles="bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
          disabled={!url}
          onClick={() => startMediaJob(url, JobType.VIDEO_TO_TEXT, setUrl)}
        />
        {apiError && (
          <span className="text-red-600 text-sm ml-3">{apiError}</span>
        )}
      </div>
      <JobTable />
    </div>
  );
};
