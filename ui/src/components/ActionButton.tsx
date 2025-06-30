import React from "react";

interface ActionButtonProps {
  text: string;
  styles: string;
  disabled?: boolean;
  hint?: string;
  onClick?: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  styles,
  disabled,
  hint,
  onClick,
}) => {
  const base =
    "inline-flex items-center justify-center px-6 py-3 rounded font-semibold text-white text-base transition duration-200 focus:outline-none shadow";

  return (
    <button
      type="submit"
      className={`${base} ${styles}`}
      disabled={disabled}
      title={hint}
      onClick={onClick}
    >
      <span>{text}</span>
    </button>
  );
};
