"use client";

import { useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import SystemStats from "./SystemStats";
import UpcomingEvents from "./UpcomingEvents";
import Alerts from "./Alerts";
import RecentActivity from "./RecentActivity";
import { dashboardStore } from "@/store/dashboard/dashboardStore";

export default function Dashboard() {
  const {
    ticketSale,
    revenue,
    activeEvents,
    avgTicketPrice,
    upcomingEvents,
    recentActivities,
    isLoading,
    error,
    fetchDashboardData,
  } = dashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <DashboardLayout>
      {/* Heading */}
      <div className="mb-10">
        <h3 className="text-[#F9F7F4] text-2xl font-semibold mb-2">
          Dashboard
        </h3>
        <p className="text-[#B3B3B3]">Platform overview and activity</p>
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