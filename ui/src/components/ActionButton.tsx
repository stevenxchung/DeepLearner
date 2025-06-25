import React from "react";

interface ActionButtonProps {
  text: string;
  color: string;
  hint?: string;
  onClick?: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  color,
  hint,
  onClick,
}) => {
  const base =
    "inline-flex items-center justify-center px-6 py-2 rounded font-semibold text-white text-base transition duration-200 focus:outline-none shadow";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${color}`}
      title={hint}
    >
      <span>{text}</span>
    </button>
  );
};
