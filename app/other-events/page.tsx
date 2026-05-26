"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { approveEvent, getOtherEvents } from "../actions/event";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LuChevronsUpDown } from "react-icons/lu";
import { AiOutlineEye } from "react-icons/ai";

type EventStatus = "live" | "upcoming" | "past";

interface Ticket {
  id: string;
  type: string;
  price: number;
  qtySold: number;
  startQty: number;
  startDate: string;
  stopdate: string;
  description: string;
}

interface Organizer {
  id: number;
  name: string;
  email: string;
  businessName: string;
}

interface AdminEvent {
  id: number;
  title: string;
  type: string;
  eventDate: string;
  venue: string;
  address: string;
  approved: boolean;
  createdAt: string;
  organizer: Organizer | null;
  ticketsSold: number;
  visitsCount: number;
  revenue: number;
  tickets: Ticket[];
}

interface ApiResponse {
  data: AdminEvent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const SortableHeader = ({ label }: { label: string }) => (
  <div className="flex items-center gap-1 cursor-pointer select-none whitespace-nowrap">
    <span>{label}</span>
    <LuChevronsUpDown className="w-3.5 h-3.5 text-[#6F6F6F]" />
  </div>
);

const getEventStatus = (event: AdminEvent): EventStatus => {
  const now = new Date();
  const eventDate = new Date(event.eventDate);
  if (!event.approved) return "upcoming";
  if (eventDate < now) return "past";
  return eventDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000
    ? "live"
    : "upcoming";
};

const StatusBadge = ({ status }: { status: EventStatus }) => {
  const styles: Record<EventStatus, string> = {
    live: "bg-green-500/10 text-green-400 border border-green-500/20",
    past: "bg-gray-600/10 text-gray-400 border border-gray-600/20",
    upcoming: "bg-yellow-600/10 text-yellow-500 border border-yellow-600/20",
  };
  const labels: Record<EventStatus, string> = {
    live: "Live",
    past: "Past",
    upcoming: "Upcoming",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status === "live" && (
        <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse" />
      )}
      {labels[status]}
    </span>
  );
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatCurrency = (amount: number) =>
  `₦${amount.toLocaleString("en-NG")}`;

const SUMMARY_CARDS = (data: ApiResponse) => [
  {
    label: "Total Events",
    value: data.total.toString(),
    icon: "🗓",
  },
  {
    label: "Tickets Sold",
    value: data.data.reduce((s, e) => s + e.ticketsSold, 0).toLocaleString(),
    icon: "🎟",
  },
  {
    label: "Total Revenue",
    value: formatCurrency(data.data.reduce((s, e) => s + e.revenue, 0)),
    icon: "💰",
  },
  {
    label: "Total Visits",
    value: data.data.reduce((s, e) => s + e.visitsCount, 0).toLocaleString(),
    icon: "👁",
  },
];

export default function AdminEventsPage() {
  const [page, setPage] = useState(1);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<ApiResponse>({
    queryKey: ["other-events", page],
    queryFn: () => getOtherEvents(page),
  });

  const { mutate: toggleApproval } = useMutation({
    mutationFn: (event: AdminEvent) => approveEvent(event.id, !event.approved),
    onSuccess: () => {
      setTogglingId(null);
      queryClient.invalidateQueries({ queryKey: ["other-events"] });
    },
    onError: () => setTogglingId(null),
  });

  const TABLE_HEADERS = ["Event", "Organizer", "Status", "Date", "Tickets Sold", "Revenue", "Visits", "Actions"];

  return (
    <DashboardLayout>
      {/* Header */}
      <section className="mb-8 flex flex-col lg:flex-row gap-3 lg:gap-0 items-start lg:items-center justify-between">
        <div>
          <h3 className="text-[#F9F7F4] text-2xl font-semibold mb-1">All Events</h3>
          <p className="text-[#B3B3B3] text-sm">
            {data
              ? `${data.total} total event${data.total !== 1 ? "s" : ""} across all organizers`
              : "Loading..."}
          </p>
        </div>
      </section>

      {/* Summary Cards */}
      {data && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {SUMMARY_CARDS(data).map(({ label, value, icon }) => (
            <div
              key={label}
              className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-[#6F6F6F] text-xs">{label}</p>
                <span className="text-base">{icon}</span>
              </div>
              <p className="text-[#F9F7F4] text-xl font-semibold">{value}</p>
            </div>
          ))}
        </section>
      )}

      {/* Table */}
      <section className="mb-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#CCA33A]" />
            <p className="text-[#6F6F6F] text-sm">Loading events...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <span className="text-red-400 text-xl">!</span>
            </div>
            <div className="text-center">
              <p className="text-[#F9F7F4] font-medium mb-1">Failed to load events</p>
              <p className="text-[#6F6F6F] text-sm">Something went wrong. Please try again.</p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-5 py-2 bg-[#CCA33A] hover:bg-[#957628] rounded-lg text-sm font-semibold transition-colors"
            >
              Retry
            </button>
          </div>
        ) : !data?.data.length ? (
          <div className="flex flex-col items-center justify-center py-24 gap-2">
            <p className="text-[#F9F7F4] font-semibold">No events found</p>
            <p className="text-[#B3B3B3] text-sm">Events will appear here once created</p>
          </div>
        ) : (
          <>
            <div className="w-full bg-[#18181B] border border-[#27272A] rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#27272A]">
                    {TABLE_HEADERS.map((h) => (
                      <th key={h} className="p-4 text-left text-[#6F6F6F] font-medium">
                        {["Actions", "Visits"].includes(h) ? h : <SortableHeader label={h} />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((event) => {
                    const status = getEventStatus(event);
                    const totalQty = event.tickets.reduce((s, t) => s + t.startQty, 0);
                    const pct = totalQty
                      ? Math.round((event.ticketsSold / totalQty) * 100)
                      : 0;
                    const isThisToggling = togglingId === event.id;

                    return (
                      <tr
                        key={event.id}
                        className="border-b border-[#27272A]/60 hover:bg-[#27272A]/30 transition-colors"
                      >
                        {/* Event */}
                        <td className="p-4 min-w-[180px]">
                          <p className="text-[#F9F7F4] font-medium leading-tight">{event.title}</p>
                          <p className="text-[#6F6F6F] text-xs mt-0.5 capitalize">
                            {event.type} · {event.venue}
                          </p>
                        </td>

                        {/* Organizer */}
                        <td className="p-4 min-w-[150px]">
                          {event.organizer ? (
                            <>
                              <p className="text-[#D4D4D4] font-medium leading-tight">
                                {event.organizer.name}
                              </p>
                              <p className="text-[#6F6F6F] text-xs mt-0.5">
                                {event.organizer.businessName}
                              </p>
                            </>
                          ) : (
                            <span className="text-[#6F6F6F]">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <StatusBadge status={status} />
                        </td>

                        {/* Date */}
                        <td className="p-4 text-[#B3B3B3] whitespace-nowrap">
                          {formatDate(event.eventDate)}
                        </td>

                        {/* Tickets Sold */}
                        <td className="p-4 min-w-[120px]">
                          <p className="text-[#F9F7F4] font-medium">
                            {event.ticketsSold.toLocaleString()}{" "}
                            <span className="text-[#6F6F6F] font-normal">
                              / {totalQty.toLocaleString()}
                            </span>
                          </p>
                          <div className="w-24 h-1 bg-[#27272A] rounded-full mt-1.5 overflow-hidden">
                            <div
                              className="h-full bg-[#CCA33A] rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="text-[#6F6F6F] text-xs mt-0.5">{pct}% sold</p>
                        </td>

                        {/* Revenue */}
                        <td className="p-4 text-[#F9F7F4] font-medium whitespace-nowrap">
                          {formatCurrency(event.revenue)}
                        </td>

                        {/* Visits */}
                        <td className="p-4 text-[#B3B3B3]">
                          {event.visitsCount.toLocaleString()}
                        </td>

                        {/* Actions */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="text-[#6F6F6F] hover:text-[#F9F7F4] transition-colors p-1.5 rounded-lg hover:bg-[#27272A]"
                              aria-label="View event"
                            >
                              <AiOutlineEye size={17} />
                            </button>
                            <button
                              disabled={isThisToggling}
                              onClick={() => {
                                setTogglingId(event.id);
                                toggleApproval(event);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 ${
                                event.approved
                                  ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                                  : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                              }`}
                            >
                              {isThisToggling ? (
                                <>
                                  <span className="animate-spin inline-block w-3 h-3 border border-current border-t-transparent rounded-full" />
                                  <span>Saving...</span>
                                </>
                              ) : event.approved ? (
                                "Unapprove"
                              ) : (
                                "Approve"
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-between mt-5 text-sm text-[#B3B3B3]">
                <p>
                  Page {data.page} of {data.totalPages} · {data.total} event{data.total !== 1 ? "s" : ""}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 rounded-lg border border-[#27272A] hover:border-[#CCA33A] hover:text-[#CCA33A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg border text-sm transition-colors ${
                        p === page
                          ? "border-[#CCA33A] text-[#CCA33A] bg-[#CCA33A]/10"
                          : "border-[#27272A] hover:border-[#CCA33A] hover:text-[#CCA33A]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    disabled={page === data.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 rounded-lg border border-[#27272A] hover:border-[#CCA33A] hover:text-[#CCA33A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </DashboardLayout>
  );
}