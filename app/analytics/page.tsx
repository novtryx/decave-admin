"use client";

// import { useState } from "react";
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

interface AnalyticsData {
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

const monthlyData: AnalyticsData = {
  stats: {
    revenue: { value: "N900,000", change: "+8.2% from last month" },
    ticketsSold: { value: "2,847", change: "+12.5% from last month" },
    conversionRate: { value: "3.8%", change: "+0.4% vs last period" },
    eventsPublished: { value: "8", change: "" },
  },
  revenueTrend: [
    { month: "Jul", value: 500000 },
    { month: "Aug", value: 650000 },
    { month: "Sep", value: 750000 },
    { month: "Oct", value: 950000 },
    { month: "Nov", value: 850000 },
    { month: "Dec", value: 1200000 },
    { month: "Jan", value: 1900000 },
  ],
  ticketsSold: [
    { month: "Jul", value: 1800 },
    { month: "Aug", value: 2100 },
    { month: "Sep", value: 2200 },
    { month: "Oct", value: 2800 },
    { month: "Nov", value: 3200 },
    { month: "Dec", value: 3600 },
    { month: "Jan", value: 4200 },
  ],
  eventPerformance: [
    { name: "Underground Sessions", value: 145 },
    { name: "Bass Revolution", value: 98 },
    { name: "Summer Vibes", value: 432 },
    { name: "Jungle Takeover", value: 76 },
    { name: "Tech House", value: 189 },
  ],
};

const yearlyData: AnalyticsData = {
  stats: {
    revenue: { value: "N10,800,000", change: "+15.3% from last year" },
    ticketsSold: { value: "34,164", change: "+18.7% from last year" },
    conversionRate: { value: "4.2%", change: "+0.8% vs last period" },
    eventsPublished: { value: "96", change: "" },
  },
  revenueTrend: [
    { month: "Jul", value: 600000 },
    { month: "Aug", value: 780000 },
    { month: "Sep", value: 900000 },
    { month: "Oct", value: 1140000 },
    { month: "Nov", value: 1020000 },
    { month: "Dec", value: 1440000 },
    { month: "Jan", value: 2280000 },
  ],
  ticketsSold: [
    { month: "Jul", value: 2160 },
    { month: "Aug", value: 2520 },
    { month: "Sep", value: 2640 },
    { month: "Oct", value: 3360 },
    { month: "Nov", value: 3840 },
    { month: "Dec", value: 4320 },
    { month: "Jan", value: 5040 },
  ],
  eventPerformance: [
    { name: "Underground Sessions", value: 1740 },
    { name: "Bass Revolution", value: 1176 },
    { name: "Summer Vibes", value: 5184 },
    { name: "Jungle Takeover", value: 912 },
    { name: "Tech House", value: 2268 },
  ],
};

const Analytics: React.FC = () => {
  // const [period, setPeriod] = useState<TimePeriod>('Monthly');
  // const currentData = period === 'Monthly' ? monthlyData : yearlyData;

  const [period, setPeriod] = useState<TimePeriod>("Monthly");
  const [data, setData] = useState<UIAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      const res = await getAnalytics();

      if (!res?.success) return;

      const analytics = res.data;

      const isMonthly = period === "Monthly";

      /* ======================
       Revenue & Tickets Trend
    ====================== */
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

      /* ======================
       Event Performance
    ====================== */
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

      /* ======================
       Stats Cards
    ====================== */
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

        {/* Stats Cards */}
        {/* <AnalyticsStats data={currentData} /> */}

        {/* Charts Grid */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RevenueTrend data={currentData.revenueTrend} />
          <TicketsSold data={currentData.ticketsSold} />
          <div className="col-span-1 lg:col-span-2">
            <EventsPerformance data={currentData.eventPerformance} />
          </div>
        </div> */}
        {loading || !data ? (
          <p className="text-[#B3B3B3]">Loading analytics...</p>
        ) : (
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
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
