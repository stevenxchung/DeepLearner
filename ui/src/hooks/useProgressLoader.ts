import { useEffect, useRef, useState } from "react";

export function useProgressLoader(loading: boolean, error?: boolean) {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (loading) {
      setProgress(0);
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) {
            return prev + 0.1; // 0.1% every 50ms
          }
          return prev;
        });
      }, 50);
    } else if (!loading && progress < 100 && !error) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Animate progress to 100% quickly
      const fastInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(fastInterval);
            setTimeout(() => setProgress(0), 450);
            return 100;
          }
          return prev + 5; // Fast fill
        });
      }, 14);
      intervalRef.current = fastInterval;
    }
    if (error) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);
      setTimeout(() => setProgress(0), 900);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loading, error]);

  return progress;
}
