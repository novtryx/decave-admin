"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

export default function Navbar() {
  return (
    <header
      className="
        fixed
        top-6
        left-1/2
        z-50
        w-[92%]
        max-w-7xl
        -translate-x-1/2
        rounded-full
        border border-white/20
        bg-transparent
        backdrop-blur-xl
        shadow-lg
      "
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/decave-logo.png"
            alt="DeCave Logo"
            width={60}
            height={60}
            priority
          />
        </div>

        {/* Public Website */}
        <Link
          href="#"
          className="
            flex items-center gap-2
            rounded-full
            border border-white/30
            px-5 py-2
            text-sm text-white
            transition
            hover:bg-white/10
          "
        >
          Go to Public Website
          <FiArrowUpRight />
        </Link>
      </div>
    </header>
  );
}
