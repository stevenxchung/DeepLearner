import { Link } from "react-router-dom";
import type { FileData } from "../types";
import { useFileContext } from "../context/FileContext";

export const Sidebar: React.FC = () => {
  const { selectedFile, setSelectedFile, files, loading, error } =
    useFileContext();

  return (
    <aside className="flex flex-col h-screen w-64 bg-[#F7F8FF] border-r border-[#E3E8F6] px-3 py-4">
      <div className="flex justify-between">
        <Link
          to="/media"
          className={
            location.pathname.startsWith("/media")
              ? "font-bold text-blue-600"
              : ""
          }
        >
          🎥 Media
        </Link>
        <Link
          to="/ai"
          className={
            location.pathname.startsWith("/ai")
              ? "font-bold text-green-600"
              : ""
          }
        >
          🤖 AI Agent
        </Link>
      </div>

      <br />

      <header className="flex flex-col gap-8 mb-6 px-2">
        <span className="font-bold text-lg tracking-tight text-[#002FA7]">
          📁 Files
        </span>
      </header>

      <div className="flex-grow overflow-y-auto">
        <div className="text-xs text-gray-500 uppercase px-1 mb-2">
          Recent files
        </div>
        <ul>
          {/* Replace below with file/thread list */}
          {loading ? (
            <li className="text-xs text-gray-400 px-2 py-1">Loading…</li>
          ) : error ? (
            <li className="text-xs text-red-500 px-2 py-1">{error}</li>
          ) : files.length === 0 ? (
            <li className="text-xs text-gray-300 px-2 py-1">No files</li>
          ) : (
            files.map((f: FileData) => (
              <li
                key={f.name}
                className={`px-3 py-2 rounded-lg cursor-pointer mb-1 transition ${
                  selectedFile === f.name
                    ? "bg-[#EBEDFA] font-semibold text-[#002FA7]"
                    : "hover:bg-[#E3E8F6] text-gray-700"
                }`}
                onClick={() => setSelectedFile(f.name)}
              >
                {f.name}
              </li>
            ))
          )}
        </ul>
      </div>

      <footer className="text-xs text-[#A780B3] mt-4 px-1 py-2 flex items-center gap-2">
        DeepLearner V1
      </footer>
    </aside>
  );
};
