"use client";

import { useEffect, useMemo, useState } from "react";
import { getAnalytics, AnalyticsData } from "@/app/actions/analytics";
import AnalyticsStats from "./AnalyticsStats";
import MoreStats from "./MoreStats";
import RevenueTrend from "./RevenueTrend";
import TicketsSold from "./TicketsSold";
import EventsPerformance from "./EventsPerformance";
import TopEventsByRevenue from "./TopEventsByRevenue";
import OperationalHealth from "./OperationalHealth";
import { DashboardLayout } from "@/components/DashboardLayout";

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

const formatChange = (value: number) =>
  `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

const getTrend = (value: number): "up" | "down" | "stable" => {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "stable";
};

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Backend keys look like "2026-1" (year-month, month is 1-indexed).
// Render those as a short month name instead of the raw key.
const formatMonthKey = (key: string): string => {
  const [, month] = key.split("-").map(Number);
  return MONTH_LABELS[month - 1] ?? key;
};

type TimePeriod = "Monthly" | "Yearly";

interface StatWithTrend {
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
}

interface UIAnalyticsData {
  stats: {
    revenue: StatWithTrend;
    ticketsSold: StatWithTrend;
    conversionRate: StatWithTrend;
    eventsPublished: StatWithTrend;
  };
  revenueTrend: Array<{ month: string; value: number }>;
  ticketsSold: Array<{ month: string; value: number }>;
  eventPerformance: Array<{ name: string; value: number }>;
  topEventsByRevenue: Array<{ name: string; value: number }>;
  checkInRate: number;
  checkInEventsConsidered: number;
  avgOrderValue: number;
  paymentCompletionRate: number;
  influencerRevenueSharePercent: number;
  paymentHealth: { totalCompleted: number; totalPending: number; totalFailed: number };
  ticketSaleWindow: {
    onSale: number;
    notYetOpen: number;
    closed: number;
    noWindowSet: number;
  };
  influencer: { influencerRevenue: number; organicRevenue: number };
}

const Analytics: React.FC = () => {
  const [period, setPeriod] = useState<TimePeriod>("Monthly");
  const [rawData, setRawData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch once — switching Monthly/Yearly is a pure client-side
  // re-slice of the same payload (the backend already returns both
  // breakdowns in one response), so there's no need to hit the
  // network again every time the toggle is clicked.
  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError(null);
      const res = await getAnalytics();

      if ("error" in res) {
        setError(res.error);
        setLoading(false);
        return;
      }

      setRawData(res.data);
      setLoading(false);
    }

    fetchAnalytics();
  }, []);

  const data: UIAnalyticsData | null = useMemo(() => {
    if (!rawData) return null;

    const isMonthly = period === "Monthly";

    const revenueTrend = Object.entries(
      isMonthly ? rawData.monthRevenue : rawData.yearRevenue
    ).map(([key, value]) => ({
      month: isMonthly ? formatMonthKey(key) : key,
      value,
    }));

    const ticketsTrend = Object.entries(
      isMonthly ? rawData.monthTickets : rawData.yearTickets
    ).map(([key, value]) => ({
      month: isMonthly ? formatMonthKey(key) : key,
      value,
    }));

    const eventPerformanceMap = new Map<string, number>();
    rawData.ticketSalesDetails.forEach((item) => {
      eventPerformanceMap.set(
        item.eventTitle,
        (eventPerformanceMap.get(item.eventTitle) || 0) + item.ticketsSold
      );
    });
    const eventPerformance = Array.from(eventPerformanceMap.entries()).map(
      ([name, value]) => ({ name, value })
    );

    const topEventsByRevenue = (rawData.topEventsByRevenue || []).map((e) => ({
      name: e.eventTitle,
      value: e.revenue,
    }));

    const revenueMetric = isMonthly ? rawData.revenueThisMonth : rawData.revenueThisYear;
    const ticketsMetric = isMonthly ? rawData.ticketsThisMonth : rawData.ticketsThisYear;
    const conversionMetric = isMonthly
      ? rawData.conversionThisMonth
      : rawData.conversionThisYear;

    const stats: UIAnalyticsData["stats"] = {
      revenue: {
        value: formatCurrency(revenueMetric.value),
        change: formatChange(revenueMetric.changePercent),
        trend: getTrend(revenueMetric.changePercent),
      },
      ticketsSold: {
        value: ticketsMetric.value.toLocaleString(),
        change: formatChange(ticketsMetric.changePercent),
        trend: getTrend(ticketsMetric.changePercent),
      },
      conversionRate: {
        value: `${conversionMetric.value.toFixed(2)}%`,
        change: formatChange(conversionMetric.changePercent),
        trend: getTrend(conversionMetric.changePercent),
      },
      eventsPublished: {
        value: rawData.totalPublishedEvents.toString(),
        change: "",
        trend: "stable",
      },
    };

    return {
      stats,
      revenueTrend,
      ticketsSold: ticketsTrend,
      eventPerformance,
      topEventsByRevenue,
      checkInRate: rawData.checkInStats?.checkInRate ?? 0,
      checkInEventsConsidered: rawData.checkInStats?.eventsConsidered ?? 0,
      avgOrderValue: rawData.avgOrderValue ?? 0,
      paymentCompletionRate: rawData.paymentHealth?.completionRate ?? 0,
      influencerRevenueSharePercent:
        rawData.influencerStats?.influencerRevenueSharePercent ?? 0,
      paymentHealth: {
        totalCompleted: rawData.paymentHealth?.totalCompleted ?? 0,
        totalPending: rawData.paymentHealth?.totalPending ?? 0,
        totalFailed: rawData.paymentHealth?.totalFailed ?? 0,
      },
      ticketSaleWindow: {
        onSale: rawData.ticketSaleWindowStats?.onSale ?? 0,
        notYetOpen: rawData.ticketSaleWindowStats?.notYetOpen ?? 0,
        closed: rawData.ticketSaleWindowStats?.closed ?? 0,
        noWindowSet: rawData.ticketSaleWindowStats?.noWindowSet ?? 0,
      },
      influencer: {
        influencerRevenue: rawData.influencerStats?.influencerRevenue ?? 0,
        organicRevenue: rawData.influencerStats?.organicRevenue ?? 0,
      },
    };
  }, [rawData, period]);

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

        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-center text-red-400">
            {error}
          </div>
        )}

        {/* Loading State with Yellow Spinner */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cca33a]"></div>
          </div>
        ) : data ? (
          <>
            <AnalyticsStats data={data} />

            <MoreStats
              checkInRate={data.checkInRate}
              checkInEventsConsidered={data.checkInEventsConsidered}
              avgOrderValue={data.avgOrderValue}
              paymentCompletionRate={data.paymentCompletionRate}
              influencerRevenueSharePercent={data.influencerRevenueSharePercent}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <RevenueTrend data={data.revenueTrend} />
              <TicketsSold data={data.ticketsSold} />
              <TopEventsByRevenue data={data.topEventsByRevenue} />
              <EventsPerformance data={data.eventPerformance} />
            </div>

            <OperationalHealth
              paymentHealth={data.paymentHealth}
              ticketSaleWindow={data.ticketSaleWindow}
              influencer={data.influencer}
            />
          </>
        ) : !error ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-[#B3B3B3]">Failed to load analytics data</p>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;