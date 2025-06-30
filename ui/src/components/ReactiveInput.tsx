import React, { useEffect, useRef } from "react";

interface ReactiveInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  styles?: string;
  disabled?: boolean;
  color?: string;
  onSubmit?: () => void;
}

export const ReactiveInput: React.FC<ReactiveInputProps> = ({
  styles = "",
  disabled,
  value,
  onSubmit,
  ...props
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = ref.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
    if (props.onInput) props.onInput(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If `Enter` (but NOT `Shift+Enter`), submit!
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      onSubmit?.();
    }
    // Otherwise, allow default behavior (e.g. `Shift+Enter` inserts newline)
    if (props.onKeyDown) props.onKeyDown(e);
  };

  return (
    <textarea
      {...props}
      ref={ref}
      className={`block w-full px-4 py-3 rounded-xl border-0 text-base transition duration-200 focus:outline-none bg-white resize-none break-words
        ${styles}`}
      rows={1}
      value={value}
      disabled={disabled}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      required
    />
  );
};
