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
import { DashboardRange } from "@/types/dashboardType";

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

const formatChange = (value: number | null) =>
  value === null ? "" : `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

const getTrend = (value: number | null): "up" | "down" | "stable" | null => {
  if (value === null) return null;
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "stable";
};

const RANGE_OPTIONS: { value: DashboardRange; label: string }[] = [
  { value: "month", label: "This Month" },
  { value: "3months", label: "Last 3 Months" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" },
];

interface StatWithTrend {
  value: string;
  change: string;
  trend: "up" | "down" | "stable" | null;
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
  const [range, setRange] = useState<DashboardRange>("all");
  const [rawData, setRawData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // The range filter (same one used on the dashboard: month / 3months
  // / year / all, defaulting to all) is server-side — switching it
  // requires a fresh fetch, unlike the old Monthly/Yearly toggle which
  // just re-sliced an already-fetched payload.
  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError(null);
      const res = await getAnalytics(range);

      if ("error" in res) {
        setError(res.error);
        setLoading(false);
        return;
      }

      setRawData(res.data);
      setLoading(false);
    }

    fetchAnalytics();
  }, [range]);

  const data: UIAnalyticsData | null = useMemo(() => {
    if (!rawData) return null;

    const revenueTrend = rawData.trend.map((point) => ({
      month: point.label,
      value: point.revenue,
    }));

    const ticketsTrend = rawData.trend.map((point) => ({
      month: point.label,
      value: point.tickets,
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

    const stats: UIAnalyticsData["stats"] = {
      revenue: {
        value: formatCurrency(rawData.revenue.value),
        change: formatChange(rawData.revenue.changePercent),
        trend: getTrend(rawData.revenue.changePercent),
      },
      ticketsSold: {
        value: rawData.tickets.value.toLocaleString(),
        change: formatChange(rawData.tickets.changePercent),
        trend: getTrend(rawData.tickets.changePercent),
      },
      conversionRate: {
        value: `${rawData.conversion.value.toFixed(2)}%`,
        change: formatChange(rawData.conversion.changePercent),
        trend: getTrend(rawData.conversion.changePercent),
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
  }, [rawData]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with range filter — same system as the dashboard */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics</h1>
            <p className="text-[#B3B3B3]">
              Monitor performance across all events
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 bg-[#151515] border border-[#27272A] rounded-xl p-1 w-fit">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRange(option.value)}
                disabled={loading}
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