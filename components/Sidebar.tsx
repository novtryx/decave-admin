import Image from "next/image";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { RiSettings3Line } from "react-icons/ri";
import {
  TbLayoutDashboard,
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from "react-icons/tb";
import { LuChartColumn, LuCreditCard } from "react-icons/lu";
import { FaHandshakeAngle } from "react-icons/fa6";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onToggleMinimize: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isMinimized,
  onClose,
  onToggleMinimize,
}) => {
  // const [activeItem, setActiveItem] = useState("dashboard");
const pathname = usePathname();
  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <TbLayoutDashboard size={22} />,
      href: "/dashboard",
    },
    {
      id: "events",
      label: "Events",
      icon: <MdOutlineCalendarMonth size={22} />,
      href: "/events",
    },
    {
      id: "sales",
      label: "Sales & Transactions",
      icon: <LuCreditCard size={22} />,
      href: "/sales-and-transactions",
    },
    {
      id: "partners",
      label: "Partners & Sponsors",
      icon: <FaHandshakeAngle size={22} />,
      href: "/partners-and-sponsors",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <LuChartColumn size={22} />,
      href: "/analytics",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <RiSettings3Line size={22} />,
      href: "/settings",
    },
  ];

  const activePath = pathname === "/" ? "/dashboard" : pathname;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          bg-[#151515] text-white
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isMinimized ? "lg:w-24" : "lg:w-64"}
          w-64  flex flex-col
        `}
      >
        {/* Logo Section */}
        <div
          className={`border-b border-[#2a2a2a] transition-all duration-300 ease-in-out
  ${isMinimized ? "px-2 pt-4 pb-4" : "px-6 pt-4 pb-6"}`}
        >
          <div
            className={`flex justify-between items-start
    ${isMinimized ? "flex-col-reverse gap-3" : "flex-row"}
  `}
          >
            {/* Logo + Text */}
            <div
              className={`flex gap-2 transition-all duration-300 ease-in-out
      ${isMinimized ? "flex-col items-center" : "flex-col"}`}
            >
              {/* Logo */}
              <Image
                src="/decave-logo.png"
                width={isMinimized ? 60 : 70}
                height={isMinimized ? 60 : 70}
                alt="deCave logo image"
                className={`object-contain transition-transform duration-300 ease-in-out
        ${isMinimized ? "scale-90" : "scale-100"}`}
              />

              {/* Full text (deCave / Admin Panel) */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden
        ${
          isMinimized
            ? "opacity-0 max-h-0 translate-y-1"
            : "opacity-100 max-h-20 translate-y-0"
        }`}
              >
                <h1 className="text-xl font-semibold text-white my-3">
                  deCave
                </h1>
                <p className="text-sm text-[#71717B]">Admin Panel</p>
              </div>

              {/* Minimized text (dC) */}
              {isMinimized && (
                <div
                  className={`text-md font-semibold tracking-wide transition-all duration-300 ease-in-out
        ${
          isMinimized ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
        }`}
                >
                  <h1 className="text-xl font-semibold text-white mb-2">dC</h1>
                  <p className="text-sm text-[#71717B]">Admin</p>
                </div>
              )}
            </div>

            {/* Desktop minimize toggle */}
            <button
              onClick={onToggleMinimize}
              className={`hidden lg:block  py-2 rounded-lg
      transition-all duration-300 ease-in-out text-white hover:text-gray-200
      ${isMinimized ? "self-start" : ""}`}
              title={isMinimized ? "Expand sidebar" : "Minimize sidebar"}
            >
              {isMinimized ? (
                <TbLayoutSidebarRightCollapse size={20} />
              ) : (
                <TbLayoutSidebarLeftCollapse size={20} />
              )}
            </button>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
            >
              <AiOutlineClose size={20} />
            </button>
          </div>
        </div>

       {/* Navigation */}
<nav className="flex-1 overflow-y-auto px-4 py-4">
  <ul className="space-y-2">
    {menuItems.map((item) => {
      // const isActive = activePath === item.href;

      const isActive =
  activePath === item.href ||
  activePath.startsWith(`${item.href}/`);
  
      return (
        <li key={item.id}>
          <Link
            href={item.href}
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            className={`
              flex items-center px-4 py-3 rounded-lg
              transition-all duration-200
              ${
                isActive
                  ? "bg-[#d4af37] text-white font-medium shadow-lg"
                  : "text-[#6F6F6F] hover:bg-gray-800 hover:text-white"
              }
              ${isMinimized ? "justify-center" : "space-x-3"}
            `}
            title={isMinimized ? item.label : ""}
          >
            <span className={isActive ? "text-white" : ""}>
              {item.icon}
            </span>

            <span className={`${isMinimized ? "lg:hidden" : "block"}`}>
              {item.label}
            </span>
          </Link>
        </li>
      );
    })}
  </ul>
</nav>


        {/* User Section at Bottom */}
        <div className="border-t border-gray-800 p-4">
          {!isMinimized ? (
            <div className="flex items-center space-x-3 px-2">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-400 truncate">
                  admin@decave.com
                </p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold mx-auto">
              AD
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
