"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { FaPlus } from "react-icons/fa6";
import PartnerStats from "./PartnerStats";
import { SortDropdown } from "@/components/events/SortDropdown";
import { FiSearch } from "react-icons/fi";
import PartnerSponsorSection from "./PartnerSponsorSection";
import Link from "next/link";

export default function PartnersAndSponsors() {
  const periodOptions = [
    { label: "All", value: "all" },
    { label: "Bronze", value: "bronze" },
    { label: "Silver", value: "silver" },
    { label: "Gold", value: "gold" },
    { label: "Platinum", value: "platinum" },
  ];
  return (
    <DashboardLayout>
      {/* Heading */}
      <section className="mb-10 flex flex-col lg:flex-row gap-4 lg:gap-0 items-start lg:items-center justify-between">
        <div>
          <h3 className="text-[#F9F7F4] text-2xl font-semibold mb-2">
            Partners & Sponsors
          </h3>
          <p className="text-[#B3B3B3]">Manage sponsorship relationships</p>
        </div>

        {/* Add Partner Button */}
        <Link href="/partners-and-sponsors/add-partner" className="flex gap-2 items-center rounded-xl bg-[#cca33a] px-4 py-3 font-semibold">
          <FaPlus size={20} />
          Add Partner
        </Link>
      </section>

      {/* Partner Stats Section */}
      <PartnerStats />

      {/* Search Function */}
      <section className="flex flex-col lg:flex-row gap-4 mb-10">
        <div className="w-full relative">
          <input
            type="text"
            className="bg-[#18181B] w-full p-3 pl-10 rounded-xl border border-[#27272A] placeholder:text-[#6F6F6F]"
            placeholder="Search partners.."
          />
          <FiSearch className="absolute top-4 left-3 text-lg text-[#6F6F6F]" />
        </div>

        <div>
          <SortDropdown
            options={periodOptions}
            placeholder="Ticket"
            onChange={(value) => console.log("Sorted by:", value)}
          />
        </div>
      </section>

      {/* Partner and Sponsors Cards Section */}
      <PartnerSponsorSection />
    </DashboardLayout>
  );
}
