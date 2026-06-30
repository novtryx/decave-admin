"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { MdOutlineFileDownload, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import TransactionStats from "./TransactionStats";
import { SortDropdown } from "@/components/events/SortDropdown";
import { TransactionTable } from "@/components/sales-and-transactions/TransactionTable";
import { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import {
  searchEventSummaries,
  searchTransactions,
  filterTransactionsByStatus,
  sortTransactionsByDate,
  filterTransactionsByPeriod,
  exportTransactions,
  formatDate,
} from "@/constants/functions";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransactionStore } from "@/store/transactions/transactionStore";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
];

const sortOptions = [
  { label: "All", value: "all" },
  { label: "Newest", value: "new" },
  { label: "Oldest", value: "old" },
];

const periodOptions = [
  { label: "All Time", value: "all" },
  { label: "This Month", value: "this-month" },
  { label: "Last Month", value: "last-month" },
];

function EventStatusChip({ count, label, color }: { count: number; label: string; color: string }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${color}`}>
      {count} {label}
    </span>
  );
}

function SalesAndTransactionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const eventId = searchParams.get("eventId");
  const currentPage = parseInt(searchParams.get("page") || "1");

  const {
    eventSummaries,
    summaryPagination,
    summaryLoading,
    summaryError,
    fetchEventSummaries,
    selectedEvent,
    transactions,
    totals,
    transactionsPagination,
    detailLoading,
    detailError,
    fetchEventTransactions,
    clearSelectedEvent,
  } = useTransactionStore();

  // Landing-view local UI state
  const [eventSearchQuery, setEventSearchQuery] = useState("");

  // Drill-down local UI state
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"all" | "new" | "old">("all");
  const [periodFilter, setPeriodFilter] = useState<"all" | "this-month" | "last-month">("all");

  // Fetch whichever view is active whenever the URL changes
  useEffect(() => {
    if (eventId) {
      fetchEventTransactions(eventId, currentPage);
    } else {
      clearSelectedEvent();
      fetchEventSummaries(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, currentPage]);

  // Reset per-view filters when switching between events / pages so
  // stale filters from a previous event don't silently carry over
  useEffect(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortOrder("all");
    setPeriodFilter("all");
  }, [eventId]);

  const filteredEventSummaries = useMemo(
    () => searchEventSummaries(eventSummaries, eventSearchQuery),
    [eventSummaries, eventSearchQuery]
  );

  const filteredTransactions = useMemo(() => {
    let result = transactions;
    result = searchTransactions(result, searchQuery);
    result = filterTransactionsByStatus(result, statusFilter);
    result = filterTransactionsByPeriod(result, periodFilter);
    result = sortTransactionsByDate(result, sortOrder);
    return result;
  }, [transactions, searchQuery, statusFilter, periodFilter, sortOrder]);

  const goToEvent = (id: string) => {
    router.push(`?eventId=${id}`);
  };

  const goBackToEvents = () => {
    router.push("/sales-and-transactions");
  };

  const buildPageHref = (page: number) => {
    const params = new URLSearchParams();
    if (eventId) params.set("eventId", eventId);
    params.set("page", String(page));
    return `?${params.toString()}`;
  };

  const pagination = eventId ? transactionsPagination : summaryPagination;
  const isLoading = eventId ? detailLoading : summaryLoading;
  const error = eventId ? detailError : summaryError;

  const handleExport = (format: "csv" | "excel" | "json") => {
    const filenameBase = selectedEvent
      ? `${selectedEvent.eventTitle}-transactions`.toLowerCase().replace(/\s+/g, "-")
      : "transactions";

    const dataToExport =
      searchQuery || statusFilter !== "all" || periodFilter !== "all"
        ? filteredTransactions
        : transactions;

    exportTransactions(dataToExport, format, filenameBase);
    setShowExportMenu(false);
  };

  return (
    <DashboardLayout>
      {/* Heading */}
      <section className="mb-10 flex flex-col lg:flex-row gap-4 lg:gap-0 items-start lg:items-center justify-between">
        <div>
          {eventId ? (
            <button
              onClick={goBackToEvents}
              className="flex items-center gap-2 text-[#9F9FA9] hover:text-[#F9F7F4] transition-colors mb-2 text-sm"
            >
              <FiArrowLeft /> Back to Events
            </button>
          ) : null}
          <h3 className="text-[#F9F7F4] text-2xl font-semibold mb-2">
            {eventId
              ? selectedEvent?.eventTitle || "Event Transactions"
              : "Sales and Transactions"}
          </h3>
          <p className="text-[#B3B3B3]">
            {eventId
              ? "Transactions and ticket sales for this event"
              : "Select an event to view its ticket sales and payment history"}
          </p>
        </div>

        {eventId && (
          <div className="relative w-full sm:w-fit">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex gap-2 w-full sm:w-fit justify-center items-center rounded-xl bg-[#cca33a] px-4 py-3 font-semibold hover:bg-[#b8923a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={transactions.length === 0}
            >
              <MdOutlineFileDownload size={20} />
              Export Data
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#18181B] border border-[#27272A] rounded-xl shadow-lg z-10">
                <button
                  onClick={() => handleExport("csv")}
                  className="w-full text-left px-4 py-3 text-[#F9F7F4] hover:bg-[#27272A] transition-colors rounded-t-xl"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExport("excel")}
                  className="w-full text-left px-4 py-3 text-[#F9F7F4] hover:bg-[#27272A] transition-colors"
                >
                  Export as Excel
                </button>
                <button
                  onClick={() => handleExport("json")}
                  className="w-full text-left px-4 py-3 text-[#F9F7F4] hover:bg-[#27272A] transition-colors rounded-b-xl"
                >
                  Export as JSON
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {eventId && <TransactionStats totals={totals} loading={detailLoading} />}

      {/* Search and Filter Section */}
      <section className="flex flex-col lg:flex-row gap-4 mb-10">
        <div className="w-full relative">
          <input
            type="text"
            value={eventId ? searchQuery : eventSearchQuery}
            onChange={(e) =>
              eventId ? setSearchQuery(e.target.value) : setEventSearchQuery(e.target.value)
            }
            className="bg-[#18181B] w-full p-3 pl-10 rounded-xl border border-[#27272A] placeholder:text-[#6F6F6F] text-[#F9F7F4]"
            placeholder={
              eventId
                ? "Search by transaction ID, ticket type, or email..."
                : "Search by event title or venue..."
            }
          />
          <FiSearch className="absolute top-4 left-3 text-lg text-[#6F6F6F]" />
          {(eventId ? searchQuery : eventSearchQuery) && (
            <button
              onClick={() => (eventId ? setSearchQuery("") : setEventSearchQuery(""))}
              className="absolute top-3 right-3 text-[#6F6F6F] hover:text-[#F9F7F4] transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {eventId && (
          <>
            <div>
              <SortDropdown
                options={periodOptions}
                onChange={(value) =>
                  setPeriodFilter(value as "all" | "this-month" | "last-month")
                }
              />
            </div>
            <div>
              <SortDropdown
                options={sortOptions}
                placeholder="Sort"
                onChange={(value) => setSortOrder(value as "all" | "new" | "old")}
              />
            </div>
            <div>
              <SortDropdown
                options={statusOptions}
                placeholder="Status"
                onChange={(value) => setStatusFilter(value)}
              />
            </div>
          </>
        )}
      </section>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* ============================= */}
      {/* LANDING VIEW — events list   */}
      {/* ============================= */}
      {!eventId && (
        <section className="mb-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cca33a]"></div>
            </div>
          ) : filteredEventSummaries.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#6F6F6F]">
              <p className="text-lg mb-2">No events found</p>
              {eventSearchQuery && (
                <button
                  onClick={() => setEventSearchQuery("")}
                  className="mt-4 text-[#cca33a] hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredEventSummaries.map((event) => (
                <button
                  key={event._id}
                  onClick={() => goToEvent(event._id)}
                  className="text-left bg-[#151515] border border-[#27272A] rounded-2xl overflow-hidden hover:border-[#cca33a]/60 transition-colors"
                >
                  <div className="relative w-full h-36 bg-[#0c0c0c]">
                    {event.eventBanner && (
                      <Image
                        src={event.eventBanner}
                        alt={event.eventTitle}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                    <span
                      className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium ${
                        event.published
                          ? "bg-[#0F2A1A] text-[#22C55E]"
                          : "bg-[#27272A] text-[#9F9FA9]"
                      }`}
                    >
                      {event.published ? "Published" : "Draft"}
                    </span>
                  </div>

                  <div className="p-4">
                    <h4 className="text-[#F4F4F5] font-semibold text-lg truncate mb-1">
                      {event.eventTitle}
                    </h4>
                    <p className="text-[#9F9FA9] text-sm mb-3 truncate">
                      {event.venue} • {formatDate(event.startDate)}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#F4F4F5] text-xl font-semibold">
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                          minimumFractionDigits: 0,
                        }).format(event.totalRevenue)}
                      </span>
                      <span className="text-[#9F9FA9] text-xs">
                        {event.totalTicketsSold} tickets sold
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <EventStatusChip
                        count={event.totalCompleted}
                        label="Completed"
                        color="bg-[#0F2A1A] text-[#22C55E]"
                      />
                      <EventStatusChip
                        count={event.totalPending}
                        label="Pending"
                        color="bg-[#2A1F0F] text-[#F59E0B]"
                      />
                      <EventStatusChip
                        count={event.totalFailed}
                        label="Failed"
                        color="bg-[#2A0F0F] text-[#EF4444]"
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ============================= */}
      {/* DRILL-DOWN VIEW — transactions */}
      {/* ============================= */}
      {eventId && (
        <>
          {searchQuery && (
            <div className="mb-4 text-sm text-[#B3B3B3]">
              Found {filteredTransactions.length} transaction
              {filteredTransactions.length !== 1 ? "s" : ""} on this page matching &quot;{searchQuery}&quot;
            </div>
          )}

          <section className="mb-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cca33a]"></div>
              </div>
            ) : filteredTransactions.length === 0 && !error ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#6F6F6F]">
                <p className="text-lg mb-2">No transactions found</p>
                {(searchQuery || statusFilter !== "all" || periodFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setPeriodFilter("all");
                      setSortOrder("all");
                    }}
                    className="mt-4 text-[#cca33a] hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <TransactionTable transactions={filteredTransactions} />
            )}
          </section>
        </>
      )}

      {/* ============================= */}
      {/* PAGINATION (shared)           */}
      {/* ============================= */}
      {!isLoading && pagination.total > 0 && (
        <section className="mb-20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[#B3B3B3]">
            Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
            {Math.min(currentPage * pagination.limit, pagination.total)} of{" "}
            {pagination.total} {eventId ? "transactions" : "events"}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(buildPageHref(currentPage - 1))}
              disabled={!pagination.hasPrev}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#18181B] border border-[#27272A] text-[#F9F7F4] hover:bg-[#27272A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#18181B]"
            >
              <MdChevronLeft size={20} />
              Previous
            </button>

            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => router.push(buildPageHref(page))}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? "bg-[#cca33a] text-black font-semibold"
                      : "bg-[#18181B] border border-[#27272A] text-[#F9F7F4] hover:bg-[#27272A]"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <div className="sm:hidden px-3 py-2 bg-[#18181B] border border-[#27272A] text-[#F9F7F4] rounded-lg">
              {currentPage} / {pagination.pages}
            </div>

            <button
              onClick={() => router.push(buildPageHref(currentPage + 1))}
              disabled={!pagination.hasNext}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#18181B] border border-[#27272A] text-[#F9F7F4] hover:bg-[#27272A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#18181B]"
            >
              Next
              <MdChevronRight size={20} />
            </button>
          </div>
        </section>
      )}

      {showExportMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setShowExportMenu(false)} />
      )}
    </DashboardLayout>
  );
}

export default function SalesAndTransactions() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cca33a]"></div>
          </div>
        </DashboardLayout>
      }
    >
      <SalesAndTransactionsContent />
    </Suspense>
  );
}