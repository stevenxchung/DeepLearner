import React from "react";

interface ActionButtonProps {
  loading: boolean;
  error?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  loading,
  error,
  disabled,
  onClick,
}) => {
  const getButtonText = () => {
    if (loading) return "Processing...";
    else if (error) return "Retry";
    return "Extract Audio";
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        padding: "0.5rem 2rem",
        fontSize: "1rem",
        minWidth: 180,
        fontWeight: 600,
        border: "none",
        borderRadius: 8,
        outline: "none",
        color: "#fff",
        background: error
          ? "linear-gradient(90deg, #d32f2f 0%, #ef5350 100%)"
          : "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
        boxShadow:
          "0px 2px 4px rgba(33,150,243,0.14),0px 0.5px 1.5px rgba(33,150,243,0.2)",
        letterSpacing: 1,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.66 : 1,
        transition:
          "background 0.2s cubic-bezier(.86,0,.07,1), box-shadow 0.2s, opacity 0.2s",
        position: "relative",
        userSelect: "none",
      }}
    >
      <span style={{ marginLeft: loading ? 16 : 0 }}>{getButtonText()}</span>
    </button>
  );
};
