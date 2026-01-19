"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { FullScreenLoader } from "./FullScreenLoader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <FullScreenLoader/>
      {/* Sidebar (fixed, outside content flow) */}
      <Sidebar
        isOpen={isSidebarOpen}
        isMinimized={isSidebarMinimized}
        onClose={() => setIsSidebarOpen(false)}
        onToggleMinimize={() => setIsSidebarMinimized(!isSidebarMinimized)}
      />

      {/* Content wrapper */}
      <div
        className={`
          flex flex-col min-h-screen transition-all duration-300
          ${isSidebarMinimized ? "lg:ml-24" : "lg:ml-64"}
        `}
      >
        {/* Header */}
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          onLogout={() => {}}
        />

        {/* Main content (ONLY thing that scrolls) */}
        <main className="flex-1 overflow-y-auto bg-[#0F0F0F] p-4 pt-8 text-white">
          {children}
        </main>
      </div>
    </div>
  );
};
