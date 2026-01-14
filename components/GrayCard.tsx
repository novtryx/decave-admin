import React from "react";

interface GrayCardProps {
  children: React.ReactNode;
  borderLeftColor?: string;
}

export default function GrayCard({ children, borderLeftColor }: GrayCardProps) {
  return (
    <div
      className={`
        bg-[#2a2a2a] 
        p-4 
        rounded-lg 
        mt-4
        ${borderLeftColor ? "border-l-4" : ""}
      `}
      style={{
        borderLeftColor: borderLeftColor,
      }}
    >
      {children}
    </div>
  );
}
