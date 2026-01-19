"use client";

import { useLoadingStore } from "@/store/LoadingState";
import Image from "next/image";


export const FullScreenLoader = () => {
  const {isLoading} = useLoadingStore()

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Logo */}
        <Image
          src="/decave-logo.png" // 👈 replace with your logo path
          alt="Loading"
          width={80}
          height={80}
          className="animate-pulse"
        />

        {/* Optional subtle loader ring */}
        {/* <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" /> */}
      </div>

    </div>
  );
};
