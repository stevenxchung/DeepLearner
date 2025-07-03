import React, { useState, useRef, useEffect } from "react";
import type { FileData } from "../types";

interface SidebarItemProps {
  file: FileData;
  selected: boolean;
  onSelect: (name: string) => void;
  onDelete: (name: string) => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  file,
  selected,
  onSelect,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <li
      className={`flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer mb-1 transition ${
        selected
          ? "bg-[#EBEDFA] font-semibold text-[#002FA7]"
          : "hover:bg-[#E3E8F6] text-gray-700"
      }`}
      onClick={() => onSelect(file.name)}
    >
      <span className="truncate">{file.name}</span>

      <div
        className="relative ml-2"
        onClick={(e) => {
          e.stopPropagation(); // Prevent selecting on menu click
          setOpen((open) => !open);
        }}
      >
        <button
          aria-label="Show options"
          type="button"
          className="text-gray-500 hover:text-gray-700 rounded-full p-1"
        >
          <svg
            width={18}
            height={18}
            viewBox="0 0 20 20"
            fill="none"
            className="pointer-events-none"
          >
            <circle cx="4" cy="10" r="2" fill="currentColor" />
            <circle cx="10" cy="10" r="2" fill="currentColor" />
            <circle cx="16" cy="10" r="2" fill="currentColor" />
          </svg>
        </button>
        {open && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-1 bg-white border border-gray-200 shadow rounded z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-red-100 text-red-600 block"
              onClick={() => {
                setOpen(false);
                onDelete(file.name);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </li>
  );
};
