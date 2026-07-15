"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState, useCallback, useRef } from "react";
import { FiSearch, FiDownload } from "react-icons/fi";
import { getAllEvents } from "@/app/actions/event";
import {
  scanCheckIn,
  manualCheckIn,
  searchAttendees,
  getLiveDoorMetrics,
  getAttendanceExport,
} from "@/app/actions/checkin";
import type { Event } from "@/types/eventsType";
import type { LiveDoorMetrics, AttendeeSearchResult, CheckInScanResponse } from "@/types/checkinType";
import QRScanner from "@/components/checkin/QRScanner";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(value || 0);

function MetricCard({ label, value, tone }: { label: string; value: string; tone?: "positive" | "warning" }) {
  const color = tone === "positive" ? "text-[#22C55E]" : tone === "warning" ? "text-[#F59E0B]" : "text-white";
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
      <p className="text-xs text-[#9F9FA9] mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default function CheckInPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventId, setEventId] = useState("");
  const [metrics, setMetrics] = useState<LiveDoorMetrics | null>(null);

  const [scanResult, setScanResult] = useState<CheckInScanResponse | { error: string } | null>(null);
  const [scanBusy, setScanBusy] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AttendeeSearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    getAllEvents(1, 100).then((res) => {
      if (!("error" in res)) setEvents(res.data);
    });
  }, []);

  const loadMetrics = useCallback(async () => {
    if (!eventId) return;
    const res = await getLiveDoorMetrics(eventId);
    if (!("error" in res) && res.success) setMetrics(res.data);
  }, [eventId]);

  useEffect(() => {
    setMetrics(null);
    setSearchResults([]);
    setSearchQuery("");
    if (!eventId) return;

    loadMetrics();
    pollRef.current = setInterval(loadMetrics, 15000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [eventId, loadMetrics]);

  const handleScan = async (code: string) => {
    setScanBusy(true);
    const res = await scanCheckIn(code);
    setScanBusy(false);
    setScanResult(res);
    loadMetrics();
    setTimeout(() => setScanResult(null), 6000);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId || !searchQuery.trim()) return;
    setSearching(true);
    const res = await searchAttendees(eventId, searchQuery);
    setSearching(false);
    if (!("error" in res) && res.success) setSearchResults(res.data);
  };

  const handleManualCheckIn = async (result: AttendeeSearchResult) => {
    const res = await manualCheckIn(result.txnId, result.ticketId);
    setScanResult(res);
    loadMetrics();
    handleSearch({ preventDefault: () => {} } as React.FormEvent);
    setTimeout(() => setScanResult(null), 6000);
  };

  const handleExport = async () => {
    if (!eventId) return;
    const res = await getAttendanceExport(eventId);
    if ("error" in res || !res.success) return;

    const { eventTitle, rows } = res.data;
    const headers = ["Ticket ID", "Name", "Email", "Phone", "Ticket Type", "Tier", "Checked In", "Check-In Time"];
    const csvRows = rows.map((r) => [
      r.ticketId,
      r.fullName,
      r.email,
      r.phoneNumber,
      r.ticketName,
      r.tierCategory,
      r.checkedIn ? "Yes" : "No",
      r.checkedInAt ? new Date(r.checkedInAt).toLocaleString() : "",
    ]);
    const csv = [headers, ...csvRows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${eventTitle.replace(/\s+/g, "_")}_attendance_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Check-In</h1>
          <p className="text-sm text-[#9F9FA9] mt-1">Scan tickets at the door and track live attendance.</p>
        </div>
        <select
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white min-w-[220px]"
        >
          <option value="">Select an event…</option>
          {events.map((ev) => (
            <option key={ev._id} value={ev._id}>
              {ev.eventDetails.eventTitle}
            </option>
          ))}
        </select>
      </div>

      {!eventId ? (
        <p className="text-center py-20 text-[#9F9FA9]">Select an event to start checking guests in.</p>
      ) : (
        <>
          {/* Scan result banner */}
          {scanResult && (
            <div
              className={`mb-6 px-4 py-3 rounded-lg text-sm ${
                "error" in scanResult
                  ? "bg-[#2A0F0F] text-[#EF4444]"
                  : scanResult.duplicate
                  ? "bg-[#2A1F0F] text-[#F59E0B]"
                  : "bg-[#0F2A1A] text-[#22C55E]"
              }`}
            >
              {"error" in scanResult
                ? scanResult.error
                : scanResult.duplicate
                ? `⚠ Already checked in — ${scanResult.buyer.fullName} (${new Date(scanResult.buyer.checkedInAt).toLocaleTimeString()})`
                : `✓ Checked in — ${scanResult.buyer.fullName}`}
            </div>
          )}

          {/* Live metrics */}
          {metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
              <MetricCard label="Expected" value={String(metrics.expectedGuests)} />
              <MetricCard label="Checked In" value={String(metrics.checkedInGuests)} tone="positive" />
              <MetricCard label="Not Arrived" value={String(metrics.notYetArrived)} tone="warning" />
              <MetricCard label="Check-In Rate" value={`${metrics.checkInRate}%`} />
              <MetricCard
                label="Peak Entry Hour"
                value={metrics.peakEntryHour !== null ? `${metrics.peakEntryHour}:00` : "—"}
              />
              <MetricCard label="Gate Sales" value={String(metrics.gateSalesCount)} />
              <MetricCard label="Door Revenue" value={formatCurrency(metrics.doorRevenue)} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scanner */}
            <QRScanner onScan={handleScan} disabled={scanBusy} />

            {/* Manual search */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FiSearch /> Manual Search
              </h3>
              <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, phone, or ticket code…"
                  className="flex-1 bg-transparent border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-600"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="px-4 py-2.5 rounded-lg bg-[#cca33a] text-black text-sm font-medium disabled:opacity-50"
                >
                  Search
                </button>
              </form>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {searchResults.map((r) => (
                  <div
                    key={r.ticketId}
                    className="flex items-center justify-between bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2"
                  >
                    <div>
                      <p className="text-sm text-white">{r.fullName}</p>
                      <p className="text-xs text-[#9F9FA9]">{r.email}</p>
                    </div>
                    {r.checkedIn ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-[#0F2A1A] text-[#22C55E]">
                        Checked In
                      </span>
                    ) : (
                      <button
                        onClick={() => handleManualCheckIn(r)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-[#cca33a] text-black font-medium"
                      >
                        Check In
                      </button>
                    )}
                  </div>
                ))}
                {searchResults.length === 0 && searchQuery && !searching && (
                  <p className="text-xs text-[#6F6F6F] text-center py-4">No matches found.</p>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="mt-6 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm hover:bg-[#2a2a2a]"
          >
            <FiDownload /> Export Attendance Report (CSV)
          </button>
        </>
      )}
    </DashboardLayout>
  );
}