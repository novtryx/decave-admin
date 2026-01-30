"use client";

import { useEffect, useState } from "react";
import FlashCard from "@/components/dashboard/FlashCard";
import { FaCheck, FaHandshakeAngle } from "react-icons/fa6";
import { LuTicket } from "react-icons/lu";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { getAllPartners } from "@/app/actions/partners";

interface PartnerStatsData {
  totalPartners: number;
  activePartners: number;
  platinumTier: number;
  totalEventAssociations: number;
}

export default function PartnerStats() {
  const [stats, setStats] = useState<PartnerStatsData>({
    totalPartners: 0,
    activePartners: 0,
    platinumTier: 0,
    totalEventAssociations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await getAllPartners();
        
        if (response.success && response.data) {
          const partners = response.data;
          
          // Calculate stats
          const totalPartners = partners.length;
          const activePartners = partners.filter(
            (p) => p.status === "Active"
          ).length;
          const platinumTier = partners.filter(
            (p) => p.sponsorshipTier.toLowerCase() === "platinum"
          ).length;
          
          // Count total event associations (including duplicates across partners)
          const totalEventAssociations = partners.reduce((total, partner) => {
            return total + (partner.associatedEvents?.length || 0);
          }, 0);

          setStats({
            totalPartners,
            activePartners,
            platinumTier,
            totalEventAssociations,
          });
        }
      } catch (err) {
        console.error("Error fetching partner stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statsData = [
    {
      id: 1,
      icon: <FaHandshakeAngle />,
      title: "Total Partners",
      value: loading ? "..." : stats.totalPartners.toString(),
    },
    {
      id: 2,
      icon: <FaCheck />,
      title: "Active",
      value: loading ? "..." : stats.activePartners.toString(),
    },
    {
      id: 3,
      icon: <LuTicket />,
      title: "Platinum Tier",
      value: loading ? "..." : stats.platinumTier.toString(),
    },
    {
      id: 4,
      icon: <MdOutlineCalendarMonth />,
      title: "Event Association",
      value: loading ? "..." : stats.totalEventAssociations.toString(),
    },
  ];

  return (
    <div className="my-10 grid grid-cols-2 lg:grid-cols-4 gap-3">
      {statsData.map((item) => (
        <FlashCard key={item.id}>
          <div className="flex flex-col gap-2">
            {/* icon */}
            <div
              className={`${
                item.title === "Active"
                  ? "bg-[#0F2A1A] text-[#22C55E]"
                  : "bg-[#2A2A2A] text-[#F9F7F4]"
              } h-12 w-12 p-2 flex items-center justify-center rounded-xl text-xl`}
            >
              {item.icon}
            </div>
            {/* Title */}
            <p className="text-sm text-[#9F9FA9]">{item.title}</p>
            {/* Value */}
            <h3 className="text-2xl font-semibold text-[#F4F4F5]">
              {item.value}
            </h3>
          </div>
        </FlashCard>
      ))}
    </div>
  );
}