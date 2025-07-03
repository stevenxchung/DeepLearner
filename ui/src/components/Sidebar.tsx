import { Link } from "react-router-dom";
import type { FileData } from "../types";
import { useFileContext } from "../context/FileContext";
import { SidebarItem } from "./SidebarItem";

export const Sidebar: React.FC = () => {
  const { selectedFile, setSelectedFile, files, deleteFiles, loading, error } =
    useFileContext();

  return (
    <aside className="flex flex-col h-screen w-64 bg-[#F7F8FF] border-r border-[#E3E8F6] px-3 py-4">
      <div className="flex items-center justify-center gap-6 text-lg h-12 mx-10 mb-8 bg-indigo-200 rounded-xl">
        <Link to="/media">🎥</Link>
        <Link to="/ai">🤖</Link>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="text-xs text-gray-500 uppercase px-1 mb-2">
          📁 Recent files
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
              <SidebarItem
                key={f.name}
                file={f}
                selected={selectedFile === f.name}
                onSelect={setSelectedFile}
                onDelete={deleteFiles}
              />
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
