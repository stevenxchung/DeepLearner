import React, { createContext, useContext, useState } from "react";
import type { FileData } from "../types";
import { FILE_API_URL, useFetchFiles } from "../hooks/useFetchFiles";

type FileContextType = {
  loading: boolean;
  error: string | null;
  files: FileData[];
  selectedFile: string;
  setSelectedFile: React.Dispatch<React.SetStateAction<string>>;
  refreshFiles: () => void;
  deleteFiles: (filename: string) => void;
};

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { files, setFiles, refreshFiles, loading, error } =
    useFetchFiles(".txt");
  const [selectedFile, setSelectedFile] = useState<string>("");

  const deleteFiles = async (filename: string) => {
    if (!window.confirm(`Delete file "${filename}"?`)) return;
    try {
      const response = await fetch(
        `${FILE_API_URL}/${encodeURIComponent(filename)}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`Failed: ${await response.text()}`);
      }
      // Remove from list
      setFiles((prev: FileData[]) =>
        prev.filter((f: FileData) => f.name !== filename)
      );
      // If the selected file is being deleted, deselect
      if (selectedFile === filename) {
        setSelectedFile("");
      }
    } catch (e: any) {
      alert(`Could not delete: ${e.message}`);
    }
  };

  return (
    <FileContext.Provider
      value={{
        loading,
        error,
        files,
        selectedFile,
        setSelectedFile,
        refreshFiles,
        deleteFiles,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => {
  const ctx = useContext(FileContext);
  if (!ctx) throw new Error("useFileContext must be used within FileProvider");
  return ctx;
};
