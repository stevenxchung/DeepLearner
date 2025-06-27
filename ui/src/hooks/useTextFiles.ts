import { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_MEDIA_PROCESSOR_API_URL}/file`;

export function useTextFiles() {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/texts`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch files");
        return res.json();
      })
      .then((data: string[]) => {
        setFiles(data);
        setLoading(false);
        setError(null);
      })
      .catch(() => {
        setFiles([]);
        setLoading(false);
        setError("Failed to load file list");
      });
  }, []);

  return { files, loading, error };
}
