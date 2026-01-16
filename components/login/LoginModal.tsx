"use client";

import React from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function LoginModal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#151515]/50"
      />

      {/* Modal */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          w-[90%]
          max-w-md
          -translate-x-1/2
          -translate-y-1/2
          rounded-2xl
          bg-[#151515]
          p-6
          text-white
          shadow-xl
        "
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <FiX size={20} />
        </button>

        {children}
      </div>
    </div>
  );
}
