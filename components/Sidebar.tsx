import Image from "next/image";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { RiSettings3Line } from "react-icons/ri";
import {
  TbLayoutDashboard,
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from "react-icons/tb";
import { LuChartColumn, LuCreditCard } from "react-icons/lu";
import { FaEnvelope, FaHandshakeAngle } from "react-icons/fa6";
import { HiOutlineSparkles } from "react-icons/hi2";
import { HiOutlineUserGroup } from "react-icons/hi2";       // Influencers
import { PiMoneyWavyLight } from "react-icons/pi";          // Influencer withdrawals
import { MdOutlineStorefront } from "react-icons/md";       // Other Events
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

interface MenuGroup {
  label?: string;
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isMinimized,
  onClose,
  onToggleMinimize,
}) => {
  const pathname = usePathname();

  const menuGroups: MenuGroup[] = [
    {
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: <TbLayoutDashboard size={22} />,
          href: "/dashboard",
        },
      ],
    },
    {
      label: "Events",
      items: [
        {
          id: "events",
          label: "Events",
          icon: <MdOutlineCalendarMonth size={22} />,
          href: "/events",
        },
        {
          id: "other-events",
          label: "Other Events",
          icon: <MdOutlineStorefront size={22} />,
          href: "/other-events",
        },
      ],
    },
    {
      label: "Influencers",
      items: [
        {
          id: "influencers",
          label: "Influencers",
          icon: <HiOutlineUserGroup size={22} />,
          href: "/influencers",
        },
        {
          id: "influencers-withdraw",
          label: "Transactions",
          icon: <PiMoneyWavyLight size={22} />,
          href: "/influencers-withdraw",
        },
      ],
    },
    {
      label: "Finance",
      items: [
        {
          id: "sales",
          label: "Sales & Transactions",
          icon: <LuCreditCard size={22} />,
          href: "/sales-and-transactions",
        },
      ],
    },
    {
      label: "Growth",
      items: [
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
          id: "newsletter",
          label: "Newsletter",
          icon: <FaEnvelope size={22} />,
          href: "/newsletter",
        },
        {
          id: "event-feedback",
          label: "Event Feedback",
          icon: <HiOutlineSparkles size={22} />,
          href: "/event-feedback",
        },
      ],
    },
    {
      items: [
        {
          id: "settings",
          label: "Settings",
          icon: <RiSettings3Line size={22} />,
          href: "/settings",
        },
      ],
    },
  ];

  const activePath = pathname === "/" ? "/dashboard" : pathname;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          bg-[#151515] text-white
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isMinimized ? "lg:w-24" : "lg:w-64"}
          w-64 flex flex-col
        `}
      >
        {/* Logo */}
        <div
          className={`border-b border-[#2a2a2a] transition-all duration-300 ease-in-out
            ${isMinimized ? "px-2 pt-4 pb-4" : "px-6 pt-4 pb-6"}`}
        >
          <div className={`flex justify-between items-start ${isMinimized ? "flex-col-reverse gap-3" : "flex-row"}`}>
            <div className={`flex gap-2 transition-all duration-300 ease-in-out ${isMinimized ? "flex-col items-center" : "flex-col"}`}>
              <Image
                src="/decave-logo.png"
                width={isMinimized ? 60 : 70}
                height={isMinimized ? 60 : 70}
                alt="deCave logo"
                className={`object-contain transition-transform duration-300 ease-in-out ${isMinimized ? "scale-90" : "scale-100"}`}
              />
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isMinimized ? "opacity-0 max-h-0 translate-y-1" : "opacity-100 max-h-20 translate-y-0"}`}>
                <h1 className="text-xl font-semibold text-white my-3">deCave</h1>
                <p className="text-sm text-[#71717B]">Admin Panel</p>
              </div>
              {isMinimized && (
                <div className="text-md font-semibold tracking-wide">
                  <h1 className="text-xl font-semibold text-white mb-2">dC</h1>
                  <p className="text-sm text-[#71717B]">Admin</p>
                </div>
              )}
            </div>
            <button
              onClick={onToggleMinimize}
              className={`hidden lg:block py-2 rounded-lg transition-all duration-300 ease-in-out text-white hover:text-gray-200 ${isMinimized ? "self-start" : ""}`}
              title={isMinimized ? "Expand sidebar" : "Minimize sidebar"}
            >
              {isMinimized ? <TbLayoutSidebarRightCollapse size={20} /> : <TbLayoutSidebarLeftCollapse size={20} />}
            </button>
            <button onClick={onClose} className="lg:hidden p-2 hover:bg-gray-800 rounded-lg">
              <AiOutlineClose size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="space-y-0.5">
            {menuGroups.map((group, gi) => (
              <React.Fragment key={gi}>
                {/* Group divider + label */}
                {gi > 0 && (
                  <li className={`pt-3 pb-1 ${isMinimized ? "hidden" : ""}`}>
                    {group.label && (
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#3F3F3F] px-4">
                        {group.label}
                      </p>
                    )}
                    {!group.label && <div className="border-t border-[#2a2a2a] mx-1 mb-2" />}
                  </li>
                )}
                {group.items.map((item) => {
                  const isActive = activePath === item.href || activePath.startsWith(`${item.href}/`);
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                        className={`
                          flex items-center px-4 py-3 rounded-lg
                          transition-all duration-200
                          ${isActive ? "bg-[#d4af37] text-white font-medium shadow-lg" : "text-[#6F6F6F] hover:bg-gray-800 hover:text-white"}
                          ${isMinimized ? "justify-center" : "space-x-3"}
                        `}
                        title={isMinimized ? item.label : ""}
                      >
                        <span className={isActive ? "text-white" : ""}>{item.icon}</span>
                        <span className={`${isMinimized ? "lg:hidden" : "block"}`}>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </React.Fragment>
            ))}
          </ul>
        </nav>

        {/* User */}
        <div className="border-t border-gray-800 p-4">
          {!isMinimized ? (
            <div className="flex items-center space-x-3 px-2">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold">AD</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-gray-400 truncate">admin@decave.com</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold mx-auto">AD</div>
          )}
        </div>
      </aside>
    </>
  );
};