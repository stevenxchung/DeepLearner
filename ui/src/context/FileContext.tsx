import React, { createContext, useContext, useState } from "react";
import type { FileData } from "../types";
import { useFetchFiles } from "../hooks/useFetchFiles";

type FileContextValue = {
  selectedFile: string;
  files: FileData[];
  loading: boolean;
  error: string | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<string>>;
  refreshFiles: () => void;
};

const FileContext = createContext<FileContextValue | undefined>(undefined);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { files, refreshFiles, loading, error } = useFetchFiles(".txt");
  const [selectedFile, setSelectedFile] = useState<string>("");

  return (
    <FileContext.Provider
      value={{
        selectedFile,
        files,
        loading,
        error,
        setSelectedFile,
        refreshFiles,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => {
  const value = useContext(FileContext);
  if (!value)
    throw new Error("useFileContext must be used within FileProvider");
  return value;
};
