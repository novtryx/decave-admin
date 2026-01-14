"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { LuChevronsUpDown, LuCheck } from "react-icons/lu";

export interface SortOption {
  label: string;
  value: string;
}

interface SortDropdownProps {
  options: SortOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Sort",
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(
    value ?? options[0]?.value
  );

  const selectedValue = value ?? internalValue;
  const selectedOption = options.find(
    (opt) => opt.value === selectedValue
  );

  const handleSelect = (val: string) => {
    setInternalValue(val);
    onChange?.(val);
    setOpen(false);
  };

  return (
    <div className={`relative w-44 ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="
          w-full flex items-center justify-between gap-2
          bg-[#151515] border border-[#27272A]
          px-4 py-3 rounded-xl
          text-sm text-gray-300
          hover:border-gray-600 transition
        "
      >
        <span className="truncate">
          {placeholder}: {selectedOption?.label}
        </span>
        <FaChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute z-50 mt-2 w-full
            rounded-xl border border-[#27272A]
            bg-[#0f0f0f] shadow-xl
          "
        >
          {options.map((option) => {
            const isActive = option.value === selectedValue;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full flex items-center justify-between
                  px-4 py-2.5 text-sm transition
                  ${
                    isActive
                      ? "text-white bg-[#1a1a1a]"
                      : "text-gray-400 hover:bg-[#1a1a1a]"
                  }
                `}
              >
                <span>{option.label}</span>
                {isActive && (
                  <LuCheck className="w-4 h-4 text-blue-500" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
