"use client"

import { useState } from "react";
import BottomCards from "./BottomCards";
import { FiArrowRight } from "react-icons/fi";
import LoginModal from "./LoginModal";

interface HeroProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Hero({open, setOpen}: HeroProps) {


  return (
    <section className="relative h-screen max-h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero-vid.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Main Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="max-w-3xl text-center text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-4 py-1 text-xs uppercase tracking-wide text-yellow-400">
            Admin Dashboard
          </span>

          <h1 className="mt-6 text-5xl font-semibold md:text-7xl">
            DeCave
          </h1>

          <p className="mt-4 text-lg text-gray-300 italic md:text-xl">
            Where <span className="text-white">culture</span> meets{" "}
            <span className="text-yellow-400">experience</span>
          </p>

          <p className="mx-auto mt-6 max-w-xl text-sm text-gray-400 md:text-base">
            We don't just host events — we create movements. Immersive
            experiences that celebrate African culture, elevate community,
            and redefine nightlife.
          </p>

          <button onClick={() => setOpen(true)} className="group mt-10 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-yellow-400 to-amber-500 px-8 py-3 font-medium text-white transition hover:scale-105">
            Login Admin
            <FiArrowRight className="transition group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Bottom Cards */}
      <BottomCards />

      {/* Gold Gradient */}
      <div className="absolute bottom-0 left-0 h-40 w-full bg-linear-to-t from-yellow-600 to-transparent" />

      
            

    </section>
  );
}
