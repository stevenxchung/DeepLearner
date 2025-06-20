import React, { useEffect, useState } from "react";

interface ProgressButtonProps {
  loading: boolean;
  progress: number;
  disabled?: boolean;
  onClick?: () => void;
}

export const ProgressButton: React.FC<ProgressButtonProps> = ({
  loading,
  progress,
  disabled,
  onClick,
}) => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    if (!loading || progress === 100) {
      setDots(".");
      return;
    }

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length < 3) return prev + ".";
        return "";
      });
    }, 400);

    return () => clearInterval(interval);
  }, [loading, progress]);

  // Pad the dots so it's always length 3 (for example "...", ".  ", ".. ")
  const fixedDots = dots.padEnd(3, " ");

  const getButtonText = () => {
    if (!loading) return "Extract Audio";
    if (progress === 0) return `Processing${fixedDots}`;
    return `Processing... ${Math.round(progress)}%`;
  };

  return (
    <div style={{ display: "inline-block", position: "relative", width: 220 }}>
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          padding: "0.5rem 2rem",
          fontSize: "1rem",
          width: "220px",
          position: "relative",
          overflow: "hidden",
          background: "#222",
          color: "#fff",
        }}
      >
        {loading && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #4f93ff 0%, #6be3ff 100%)",
              opacity: 0.25,
              zIndex: 1,
              transition: "width 0.2s linear",
            }}
          />
        )}
        <span
          style={{
            position: "relative",
            zIndex: 2,
            fontFamily: "inherit",
          }}
        >
          {getButtonText()}
        </span>
      </button>
    </div>
  );
};
