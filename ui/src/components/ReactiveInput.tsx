import React from "react";

interface ReactiveInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  progress: number; // 0-100, shows loader if > 0
  error?: boolean;
  loading?: boolean;
  color?: string; // progress color
}

export const ReactiveInput: React.FC<ReactiveInputProps> = ({
  progress,
  error,
  loading,
  color = "#1976d2",
  ...inputProps
}) => {
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <input
        {...inputProps}
        style={{
          left: "1rem",
          width: "100%",
          fontSize: "1rem",
          lineHeight: 2,
          padding: "0.5rem 0.75rem",
          border: error ? "1.5px solid #d32f2f" : "1.5px solid transparent",
          outline: "none",
          background: "#fdf6e3",
          color: "#222",
          borderRadius: 0,
          boxShadow:
            loading || error
              ? `0 0 0 2px ${error ? "#f8dede55" : "#90caf940"}`
              : "none",
          boxSizing: "border-box", // Ensures input matches progress bar width
          transition: "border 0.18s, box-shadow 0.18s",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 3,
          width: "100%",
          background: "rgba(0,0,0,0.04)",
          zIndex: 2,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(100, Math.max(0, progress))}%`,
            transition:
              "width 0.22s cubic-bezier(.7,0,.22,1), background 0.18s",
            background: error
              ? "linear-gradient(90deg,#d32f2f,#ef5350)"
              : `linear-gradient(90deg,${color},#42a5f5)`,
            opacity: 0.95,
            borderRadius: 0,
          }}
        />
      </div>
    </div>
  );
};
