import React from "react";

interface ReactiveInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  color?: string;
}

export const ReactiveInput: React.FC<ReactiveInputProps> = ({
  error,
  className = "",
  ...inputProps
}) => {
  return (
    <div className="relative">
      <input
        {...inputProps}
        className={`block w-full px-4 py-2 rounded border text-base shadow transition 
          duration-200 focus:outline-none bg-white 
          ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-300"
              : "border-gray-300 focus:ring-2 focus:ring-blue-300"
          } 
          ${className}`}
      />
    </div>
  );
};
