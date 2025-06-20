import { useEffect, useState } from "react";

export function useSmoothProgress(realProgress: number, speed = 1) {
  const [progress, setProgress] = useState(realProgress);

  useEffect(() => {
    let animFrame: number;
    let cancelled = false;

    const animate = () => {
      setProgress((prev) => {
        if (Math.abs(realProgress - prev) < speed) {
          return realProgress;
        }
        if (realProgress > prev) {
          return Math.min(prev + speed, realProgress);
        } else {
          return Math.max(prev - speed, realProgress);
        }
      });
      if (!cancelled && progress !== realProgress) {
        animFrame = requestAnimationFrame(animate);
      }
    };
    animate();
    return () => {
      cancelled = true;
      cancelAnimationFrame(animFrame);
    };
  }, [realProgress]);

  return progress;
}
