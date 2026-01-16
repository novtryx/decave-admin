"use client";

import React, { useRef } from "react";

interface OtpInputProps {
  length?: number;
  value: string[];
  setValue: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function OtpInput({
  length = 6,
  value,
  setValue,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return;

    const newValue = [...value];
    newValue[index] = val;
    setValue(newValue);

    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="
            h-10 lg:h-14 w-10 lg:w-12
            rounded-lg
            border border-white/30
            bg-transparent
            text-center
            text-xl
            text-white
            outline-none
            transition
            focus:border-yellow-400
            focus:ring-2
            focus:ring-yellow-400/30
          "
        />
      ))}
    </div>
  );
}
