"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getEventAnalytics,
  compareEventAnalytics,
  EventAnalyticsData,
  TierBreakdownItem,
} from "@/app/actions/analytics";
import { getAllEvents } from "@/app/actions/event";
import { Event } from "@/types/eventsType";
import { getTierLabel, SALE_WINDOW_LABELS } from "@/constants/ticketTiers";

const formatCurrency = (value: number, currency: string = "NGN") =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency }).format(value || 0);

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "—";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
      <p className="text-sm text-[#9F9FA9] mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-[#6F6F6F] mt-1">{sub}</p>}
    </div>
  );
}

function TierRow({ tier }: { tier: TierBreakdownItem }) {
  const windowMeta = SALE_WINDOW_LABELS[tier.saleWindowStatus] || SALE_WINDOW_LABELS.no_window_set;

  return (
    <tr className="border-b border-[#2a2a2a]/60">
      <td className="py-3 pr-4">
        <div className="text-white font-medium">{tier.ticketName}</div>
        <div className="text-xs text-[#9F9FA9]">{getTierLabel(tier.tierCategory)}</div>
      </td>
      <td className="py-3 pr-4 text-[#9F9FA9]">{formatCurrency(tier.price, tier.currency)}</td>
      <td className="py-3 pr-4 text-[#9F9FA9]">
        {tier.ticketsSold} / {tier.initialQuantity}
        <div className="w-24 h-1.5 bg-[#2a2a2a] rounded-full mt-1 overflow-hidden">
          <div
            className="h-full bg-[#cca33a]"
            style={{ width: `${Math.min(tier.soldPercent, 100)}%` }}
          />
        </div>
      </td>
      <td className="py-3 pr-4 text-white font-medium">{formatCurrency(tier.revenue, tier.currency)}</td>
      <td className="py-3 pr-4 text-[#9F9FA9]">{tier.salesVelocityPerDay}/day</td>
      <td className="py-3 pr-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${windowMeta.color}`}>
          {windowMeta.label}
        </span>
      </td>
      <td className="py-3 pr-4">
        {tier.unsoldInventoryFlag && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#2A1F0F] text-[#F59E0B]">
            Unsold inventory
          </span>
        )}
        {tier.recommendNextPhase && (
          <div className="text-xs text-[#cca33a] mt-1">
            Open next: {tier.recommendNextPhase}
          </div>
        )}
      </td>
    </tr>
  );
}

function EventAnalyticsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id") ?? "";

  const [data, setData] = useState<EventAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Comparison
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [compareId, setCompareId] = useState<string>("");
  const [compareData, setCompareData] = useState<EventAnalyticsData | null>(null);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    (async () => {
      setIsLoading(true);
      setError(null);
      const res = await getEventAnalytics(eventId);
      if ("error" in res) {
        setError(res.error);
      } else if (!res.success) {
        setError("Failed to load event analytics");
      } else {
        setData(res.data);
      }
      setIsLoading(false);
    })();

    getAllEvents(1, 50).then((res) => {
      if (!("error" in res)) {
        setAllEvents(res.data.filter((e) => e._id !== eventId));
      }
    });
  }, [eventId]);

  const runComparison = async () => {
    if (!compareId) return;
    setComparing(true);
    const res = await compareEventAnalytics([eventId, compareId]);
    setComparing(false);
    if (!("error" in res) && res.success) {
      const other = res.data.find((d) => d.eventId === compareId);
      setCompareData(other || null);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cca33a]" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-[#9F9FA9]">
          {error || "Event not found"}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <button
        onClick={() => router.push("/events")}
        className="flex items-center gap-2 text-[#9F9FA9] hover:text-[#F9F7F4] transition-colors mb-4 text-sm"
      >
        <FaArrowLeftLong /> Back to Events
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">{data.eventTitle}</h1>
        <p className="text-sm text-[#9F9FA9] mt-1">
          {formatDate(data.startDate)} — {formatDate(data.endDate)} ·{" "}
          {data.published ? "Published" : "Draft"}
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Tickets Created" value={String(data.totalTicketsCreated)} />
        <StatCard label="Tickets Sold" value={String(data.totalTicketsSold)} />
        <StatCard label="Tickets Remaining" value={String(data.totalTicketsRemaining)} />
        <StatCard label="Revenue" value={formatCurrency(data.totalRevenue)} />
        <StatCard label="Check-In Rate" value={`${data.checkInRate}%`} sub={`${data.totalCheckedIn} checked in`} />
        <StatCard label="No-Show Rate" value={`${data.noShowRate}%`} />
      </div>

      {/* Tier breakdown */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Ticket Tier Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#B3B3B3] border-b border-[#2a2a2a]">
                <th className="py-2 pr-4">Tier</th>
                <th className="py-2 pr-4">Price</th>
                <th className="py-2 pr-4">Sold</th>
                <th className="py-2 pr-4">Revenue</th>
                <th className="py-2 pr-4">Velocity</th>
                <th className="py-2 pr-4">Window</th>
                <th className="py-2 pr-4">Flags</th>
              </tr>
            </thead>
            <tbody>
              {data.tierBreakdown.map((tier) => (
                <TierRow key={tier.ticketId} tier={tier} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily sales trend */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Daily Sales Trend</h3>
          {data.peakSaleDay && (
            <span className="text-xs text-[#cca33a]">
              Peak day: {formatDate(data.peakSaleDay.date)} ({formatCurrency(data.peakSaleDay.revenue)})
            </span>
          )}
        </div>
        {data.dailySalesTrend.length === 0 ? (
          <p className="text-sm text-[#6F6F6F]">No sales recorded yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.dailySalesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
              <XAxis dataKey="date" stroke="#666666" tick={{ fill: "#B3B3B3", fontSize: 11 }} />
              <YAxis stroke="#666666" tick={{ fill: "#B3B3B3", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#2a2a2a",
                  border: "1px solid #3a3a3a",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#D4A017" strokeWidth={2} dot={{ fill: "#D4A017", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Compare with another event */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Compare With Another Event</h3>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <select
            value={compareId}
            onChange={(e) => setCompareId(e.target.value)}
            className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white flex-1"
          >
            <option value="">Select an event…</option>
            {allEvents.map((e) => (
              <option key={e._id} value={e._id}>
                {e.eventDetails.eventTitle}
              </option>
            ))}
          </select>
          <button
            onClick={runComparison}
            disabled={!compareId || comparing}
            className="px-4 py-2 rounded-lg bg-[#cca33a] text-black text-sm font-medium disabled:opacity-50"
          >
            {comparing ? "Comparing…" : "Compare"}
          </button>
        </div>

        {compareData && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#B3B3B3] border-b border-[#2a2a2a]">
                  <th className="py-2 pr-4">Metric</th>
                  <th className="py-2 pr-4">{data.eventTitle}</th>
                  <th className="py-2 pr-4">{compareData.eventTitle}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Tickets Sold", data.totalTicketsSold, compareData.totalTicketsSold],
                  ["Revenue", formatCurrency(data.totalRevenue), formatCurrency(compareData.totalRevenue)],
                  ["Check-In Rate", `${data.checkInRate}%`, `${compareData.checkInRate}%`],
                  ["No-Show Rate", `${data.noShowRate}%`, `${compareData.noShowRate}%`],
                ].map(([label, a, b]) => (
                  <tr key={label as string} className="border-b border-[#2a2a2a]/60">
                    <td className="py-2 pr-4 text-[#9F9FA9]">{label}</td>
                    <td className="py-2 pr-4 text-white font-medium">{a}</td>
                    <td className="py-2 pr-4 text-white font-medium">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function EventAnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <EventAnalyticsContent />
    </Suspense>
  );
}