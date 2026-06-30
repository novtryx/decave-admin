"use client";

import { useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import SystemStats from "./SystemStats";
import UpcomingEvents from "./UpcomingEvents";
import Alerts from "./Alerts";
import RecentActivity from "./RecentActivity";
import { dashboardStore } from "@/store/dashboard/dashboardStore";
import { DashboardRange } from "@/types/dashboardType";

const RANGE_OPTIONS: { value: DashboardRange; label: string }[] = [
  { value: "month", label: "This Month" },
  { value: "3months", label: "Last 3 Months" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" },
];

export default function Dashboard() {
  const {
    ticketSale,
    revenue,
    activeEvents,
    avgTicketPrice,
    upcomingEvents,
    recentActivities,
    range,
    isLoading,
    error,
    fetchDashboardData,
    setRange,
  } = dashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <DashboardLayout>
      {/* Heading */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-[#F9F7F4] text-2xl font-semibold mb-2">
            Dashboard
          </h3>
          <p className="text-[#B3B3B3]">Platform overview and activity</p>
        </div>

        {/* Range selector */}
        <div className="flex flex-wrap items-center gap-2 bg-[#151515] border border-[#27272A] rounded-xl p-1 w-fit">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRange(option.value)}
              disabled={isLoading}
              className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors disabled:cursor-not-allowed ${
                range === option.value
                  ? "bg-[#cca33a] text-[#111827] font-semibold"
                  : "text-[#9F9FA9] hover:text-[#F4F4F5]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-center text-red-400 mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <section className="flex items-center justify-center py-20 mb-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cca33a]"></div>
        </section>
      ) : (
        <>
          {/* System Stats section */}
          {ticketSale && revenue && activeEvents && avgTicketPrice && (
            <SystemStats
              ticketSale={ticketSale}
              revenue={revenue}
              activeEvents={activeEvents}
              avgTicketPrice={avgTicketPrice}
              range={range}
            />
          )}

          {/* Upcoming Events and Alerts Section */}
          <div className="my-10 grid grid-cols-1 lg:grid-cols-10 gap-4">
            <div className="lg:col-span-7">
              <UpcomingEvents events={upcomingEvents} />
            </div>
            <div className="lg:col-span-3">
              <Alerts events={upcomingEvents} />
            </div>
          </div>

          {/* Recent Activity Section */}
          <RecentActivity activities={recentActivities} />
        </>
      )}
    </DashboardLayout>
  );
}