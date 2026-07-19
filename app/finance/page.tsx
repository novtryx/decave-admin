"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { IoAddOutline, IoTrashOutline } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { getFinanceOverview, getFinanceEntries, deleteFinanceEntry } from "@/app/actions/finance";
import { getAllEvents } from "@/app/actions/event";
import type { FinanceOverview, FinanceEntry } from "@/types/financeType";
import { getCategoryLabel } from "@/types/financeType";
import type { Event } from "@/types/eventsType";
import AddFinanceEntryModal from "@/components/finance/AddFinanceEntryModal";
import { downloadCSVGeneric } from "@/constants/exportGeneric";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(value || 0);

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "—";

function OverviewCard({ label, value, tone }: { label: string; value: string; tone?: "positive" | "negative" }) {
  const color = tone === "positive" ? "text-[#22C55E]" : tone === "negative" ? "text-[#EF4444]" : "text-white";
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
      <p className="text-sm text-[#9F9FA9] mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default function FinancePage() {
  const [overview, setOverview] = useState<FinanceOverview | null>(null);
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [eventFilter, setEventFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | "credit" | "debit">("");
  const [showAddModal, setShowAddModal] = useState(false);

  const loadAll = async () => {
    setIsLoading(true);
    setError(null);

    const [overviewRes, entriesRes, eventsRes] = await Promise.all([
      getFinanceOverview(),
      getFinanceEntries({ eventId: eventFilter || undefined, type: typeFilter || undefined }, 1, 50),
      getAllEvents(1, 100),
    ]);

    if ("error" in overviewRes) {
      setError(overviewRes.error);
    } else if (overviewRes.success) {
      setOverview(overviewRes.data);
    }

    if (!("error" in entriesRes) && entriesRes.success) {
      setEntries(entriesRes.data);
    }

    if (!("error" in eventsRes)) {
      setEvents(eventsRes.data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventFilter, typeFilter]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this finance entry?")) return;
    const res = await deleteFinanceEntry(id);
    if (!("error" in res) && res.success) {
      loadAll();
    }
  };

  const handleExportEntries = () => {
    const headers = ["Date", "Event", "Type", "Category", "Description", "Amount", "Added By"];
    const rows = entries.map((e) => [
      formatDate(e.date),
      e.event?.eventDetails?.eventTitle || "General",
      e.type === "credit" ? "Credit" : "Debit",
      getCategoryLabel(e.category),
      e.description || "",
      e.amount,
      e.createdBy?.fullName || e.createdBy?.email || "",
    ]);
    downloadCSVGeneric(headers, rows, "finance-entries");
  };

  const handleExportEventProfit = () => {
    if (!overview) return;
    const headers = ["Event", "Ticket Revenue", "Other Credits", "Expenses", "Profit"];
    const rows = overview.events.map((ev) => [
      ev.eventTitle,
      ev.netTicketRevenue,
      ev.manualCredits,
      ev.totalExpenses,
      ev.profit,
    ]);
    downloadCSVGeneric(headers, rows, "profit-by-event");
  };

  if (isLoading && !overview) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cca33a]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Finance</h1>
          <p className="text-sm text-[#9F9FA9] mt-1">
            Track what you spend and what you bring in, per event or general.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#cca33a] text-black text-sm font-semibold"
        >
          <IoAddOutline size={18} />
          Add Entry
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* All-time overview */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <OverviewCard label="Total Revenue (All-Time)" value={formatCurrency(overview.allTime.totalRevenue)} tone="positive" />
          <OverviewCard label="Total Expenses (All-Time)" value={formatCurrency(overview.allTime.totalExpenses)} tone="negative" />
          <OverviewCard
            label="Net Profit (All-Time)"
            value={formatCurrency(overview.allTime.profit)}
            tone={overview.allTime.profit >= 0 ? "positive" : "negative"}
          />
        </div>
      )}

      {/* Per-event profit table */}
      {overview && overview.events.length > 0 && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Profit by Event</h3>
            <button
              onClick={handleExportEventProfit}
              className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-[#111111] border border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
            >
              <FiDownload size={14} /> Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#B3B3B3] border-b border-[#2a2a2a]">
                  <th className="py-2 pr-4">Event</th>
                  <th className="py-2 pr-4">Ticket Revenue</th>
                  <th className="py-2 pr-4">Other Credits</th>
                  <th className="py-2 pr-4">Expenses</th>
                  <th className="py-2 pr-4">Profit</th>
                </tr>
              </thead>
              <tbody>
                {overview.events.map((ev) => (
                  <tr key={ev.eventId} className="border-b border-[#2a2a2a]/60">
                    <td className="py-3 pr-4 text-white font-medium">{ev.eventTitle}</td>
                    <td className="py-3 pr-4 text-[#9F9FA9]">{formatCurrency(ev.netTicketRevenue)}</td>
                    <td className="py-3 pr-4 text-[#9F9FA9]">{formatCurrency(ev.manualCredits)}</td>
                    <td className="py-3 pr-4 text-[#EF4444]">{formatCurrency(ev.totalExpenses)}</td>
                    <td className={`py-3 pr-4 font-medium ${ev.profit >= 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                      {formatCurrency(ev.profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(overview.unassigned.credits > 0 || overview.unassigned.debits > 0) && (
            <p className="text-xs text-[#6F6F6F] mt-3">
              Plus {formatCurrency(overview.unassigned.credits)} in general credits and{" "}
              {formatCurrency(overview.unassigned.debits)} in general expenses not tied to a specific event.
            </p>
          )}
        </div>
      )}

      {/* Entries list */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-semibold text-white">Entries</h3>
          <div className="flex gap-2">
            <button
              onClick={handleExportEntries}
              disabled={entries.length === 0}
              className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-[#111111] border border-[#2a2a2a] text-white hover:bg-[#2a2a2a] disabled:opacity-50"
            >
              <FiDownload size={14} /> Export CSV
            </button>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="">All Events</option>
              <option value="unassigned">General Only</option>
              {events.map((ev) => (
                <option key={ev._id} value={ev._id}>
                  {ev.eventDetails.eventTitle}
                </option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
              className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="">Credit & Debit</option>
              <option value="credit">Credit Only</option>
              <option value="debit">Debit Only</option>
            </select>
          </div>
        </div>

        {entries.length === 0 ? (
          <p className="text-center py-12 text-[#9F9FA9] text-sm">No entries yet — add your first one.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#B3B3B3] border-b border-[#2a2a2a]">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Event</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Description</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry._id} className="border-b border-[#2a2a2a]/60">
                    <td className="py-3 pr-4 text-[#9F9FA9]">{formatDate(entry.date)}</td>
                    <td className="py-3 pr-4 text-white">
                      {entry.event?.eventDetails?.eventTitle || "General"}
                    </td>
                    <td className="py-3 pr-4 text-[#9F9FA9]">{getCategoryLabel(entry.category)}</td>
                    <td className="py-3 pr-4 text-[#9F9FA9] max-w-[220px] truncate">{entry.description || "—"}</td>
                    <td
                      className={`py-3 pr-4 font-medium ${
                        entry.type === "credit" ? "text-[#22C55E]" : "text-[#EF4444]"
                      }`}
                    >
                      {entry.type === "credit" ? "+" : "-"}
                      {formatCurrency(entry.amount)}
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={() => handleDelete(entry._id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                        aria-label="Delete entry"
                      >
                        <IoTrashOutline size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddFinanceEntryModal
        isOpen={showAddModal}
        events={events}
        onClose={() => setShowAddModal(false)}
        onSaved={loadAll}
      />
    </DashboardLayout>
  );
}