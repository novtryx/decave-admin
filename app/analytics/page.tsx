"use client";

import { useEffect, useState } from "react";
import { getAnalytics } from "@/app/actions/analytics";
import AnalyticsStats from "./AnalyticsStats";
import RevenueTrend from "./RevenueTrend";
import TicketsSold from "./TicketsSold";
import EventsPerformance from "./EventsPerformance";
import { DashboardLayout } from "@/components/DashboardLayout";

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

const formatChange = (value: number) =>
  `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

type TimePeriod = "Monthly" | "Yearly";

interface UIAnalyticsData {
  stats: {
    revenue: { value: string; change: string };
    ticketsSold: { value: string; change: string };
    conversionRate: { value: string; change: string };
    eventsPublished: { value: string; change: string };
  };
  revenueTrend: Array<{ month: string; value: number }>;
  ticketsSold: Array<{ month: string; value: number }>;
  eventPerformance: Array<{ name: string; value: number }>;
}

const Analytics: React.FC = () => {
  const [period, setPeriod] = useState<TimePeriod>("Monthly");
  const [data, setData] = useState<UIAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   async function fetchAnalytics() {
  //     setLoading(true);
  //     const res = await getAnalytics();

  //     if (!res?.success) {
  //       setLoading(false);
  //       return;
  //     }

  //     const analytics = res.data;
  //     const isMonthly = period === "Monthly";

  //     /* Revenue & Tickets Trend */
  //     const revenueTrend = Object.entries(
  //       isMonthly ? analytics.monthRevenue : analytics.yearRevenue,
  //     ).map(([key, value]) => ({
  //       month: key,
  //       value,
  //     }));

  //     const ticketsTrend = Object.entries(
  //       isMonthly ? analytics.monthTickets : analytics.yearTickets,
  //     ).map(([key, value]) => ({
  //       month: key,
  //       value,
  //     }));

  //     /* Event Performance */
  //     const eventPerformanceMap = new Map<string, number>();

  //     analytics.ticketSalesDetails.forEach((item) => {
  //       eventPerformanceMap.set(
  //         item.eventTitle,
  //         (eventPerformanceMap.get(item.eventTitle) || 0) + item.ticketsSold,
  //       );
  //     });

  //     const eventPerformance = Array.from(eventPerformanceMap.entries()).map(
  //       ([name, value]) => ({ name, value }),
  //     );

  //     /* Stats Cards */
  //     const stats: UIAnalyticsData["stats"] = {
  //       revenue: {
  //         value: formatCurrency(
  //           isMonthly
  //             ? analytics.revenueThisMonth.value
  //             : analytics.revenueThisYear.value,
  //         ),
  //         change: formatChange(
  //           isMonthly
  //             ? analytics.revenueThisMonth.changePercent
  //             : analytics.revenueThisYear.changePercent,
  //         ),
  //       },
  //       ticketsSold: {
  //         value: (isMonthly
  //           ? analytics.ticketsThisMonth.value
  //           : analytics.ticketsThisYear.value
  //         ).toLocaleString(),
  //         change: formatChange(
  //           isMonthly
  //             ? analytics.ticketsThisMonth.changePercent
  //             : analytics.ticketsThisYear.changePercent,
  //         ),
  //       },
  //       conversionRate: {
  //         value: `${(isMonthly
  //           ? analytics.conversionThisMonth.value
  //           : analytics.conversionThisYear.value
  //         ).toFixed(2)}%`,
  //         change: formatChange(
  //           isMonthly
  //             ? analytics.conversionThisMonth.changePercent
  //             : analytics.conversionThisYear.changePercent,
  //         ),
  //       },
  //       eventsPublished: {
  //         value: analytics.totalPublishedEvents.toString(),
  //         change: "",
  //       },
  //     };

  //     setData({
  //       stats,
  //       revenueTrend,
  //       ticketsSold: ticketsTrend,
  //       eventPerformance,
  //     });

  //     setLoading(false);
  //   }

  //   fetchAnalytics();
  // }, [period]);
  useEffect(() => {
  async function fetchAnalytics() {
    setLoading(true);
    const res = await getAnalytics();

    // ✅ Check for error using 'in' operator
    if ('error' in res) {
      console.error("Analytics error:", res.error);
      setLoading(false);
      return;
    }

    // ✅ Now TypeScript knows res is AnalyticsResponse
    const analytics = res.data;
    const isMonthly = period === "Monthly";

    /* Revenue & Tickets Trend */
    const revenueTrend = Object.entries(
      isMonthly ? analytics.monthRevenue : analytics.yearRevenue,
    ).map(([key, value]) => ({
      month: key,
      value,
    }));

    const ticketsTrend = Object.entries(
      isMonthly ? analytics.monthTickets : analytics.yearTickets,
    ).map(([key, value]) => ({
      month: key,
      value,
    }));

    /* Event Performance */
    const eventPerformanceMap = new Map<string, number>();

    analytics.ticketSalesDetails.forEach((item) => {
      eventPerformanceMap.set(
        item.eventTitle,
        (eventPerformanceMap.get(item.eventTitle) || 0) + item.ticketsSold,
      );
    });

    const eventPerformance = Array.from(eventPerformanceMap.entries()).map(
      ([name, value]) => ({ name, value }),
    );

    /* Stats Cards */
    const stats: UIAnalyticsData["stats"] = {
      revenue: {
        value: formatCurrency(
          isMonthly
            ? analytics.revenueThisMonth.value
            : analytics.revenueThisYear.value,
        ),
        change: formatChange(
          isMonthly
            ? analytics.revenueThisMonth.changePercent
            : analytics.revenueThisYear.changePercent,
        ),
      },
      ticketsSold: {
        value: (isMonthly
          ? analytics.ticketsThisMonth.value
          : analytics.ticketsThisYear.value
        ).toLocaleString(),
        change: formatChange(
          isMonthly
            ? analytics.ticketsThisMonth.changePercent
            : analytics.ticketsThisYear.changePercent,
        ),
      },
      conversionRate: {
        value: `${(isMonthly
          ? analytics.conversionThisMonth.value
          : analytics.conversionThisYear.value
        ).toFixed(2)}%`,
        change: formatChange(
          isMonthly
            ? analytics.conversionThisMonth.changePercent
            : analytics.conversionThisYear.changePercent,
        ),
      },
      eventsPublished: {
        value: analytics.totalPublishedEvents.toString(),
        change: "",
      },
    };

    setData({
      stats,
      revenueTrend,
      ticketsSold: ticketsTrend,
      eventPerformance,
    });

    setLoading(false);
  }

  fetchAnalytics();
}, [period]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Toggle */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics</h1>
            <p className="text-[#B3B3B3]">
              Monitor performance across all events
            </p>
          </div>
          <div className="flex bg-[#2a2a2a] rounded-lg p-1">
            <button
              onClick={() => setPeriod("Monthly")}
              className={`px-6 py-2 rounded-md transition-colors ${
                period === "Monthly"
                  ? "bg-blue-600 text-white"
                  : "text-[#B3B3B3] hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod("Yearly")}
              className={`px-6 py-2 rounded-md transition-colors ${
                period === "Yearly"
                  ? "bg-blue-600 text-white"
                  : "text-[#B3B3B3] hover:text-white"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Loading State with Yellow Spinner */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cca33a]"></div>
          </div>
        ) : data ? (
          <>
            <AnalyticsStats data={data} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <RevenueTrend data={data.revenueTrend} />
              <TicketsSold data={data.ticketsSold} />
              <div className="col-span-1 lg:col-span-2">
                <EventsPerformance data={data.eventPerformance} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-[#B3B3B3]">Failed to load analytics data</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;