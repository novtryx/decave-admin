"use client";

import Image from "next/image";

interface LogoutModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-[#0F0F0F] p-6 text-white shadow-2xl">
        {/* Logo */}
        <div className="mb-4 flex justify-center">
          <Image
            src="/decave-logo.png" // 👈 replace with your logo
            alt="Logo"
            width={56}
            height={56}
          />
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center text-lg font-semibold">
          Log out of your account?
        </h2>

        {/* Description */}
        <p className="mb-6 text-center text-sm text-white/60">
          You’ll need to sign in again to access your dashboard.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/5 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-700 transition"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};
