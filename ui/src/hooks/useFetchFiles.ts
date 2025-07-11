import { useCallback, useEffect, useState } from "react";
import type { FileData } from "../types";

export const FILE_API_URL = `${import.meta.env.VITE_MEDIA_ORX_API_URL}/file`;

export function useFetchFiles(fileExtension?: string) {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${FILE_API_URL}/files`);
      if (!response.ok) {
        throw new Error("Could not fetch files");
      }

      const data: FileData[] = await response.json();
      const filtered = fileExtension
        ? data.filter((file) => file.name.endsWith(fileExtension))
        : data;

      setFiles(filtered);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      setError("Failed to load file list");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [fileExtension]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return { files, setFiles, refreshFiles: fetchFiles, loading, error };
}
