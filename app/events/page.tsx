"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { EventTable } from "@/components/events/EventTable";
import { SortDropdown } from "@/components/events/SortDropdown";
import Link from "next/link";
import { useEffect, useMemo, useState, Suspense } from "react";
import { FaPlus } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { getAllEvents, DeleteEventAction } from "../actions/event";
import { getEventsTransactionSummary } from "../actions/transaction";
import { Event, EventsPagination } from "@/types/eventsType";
import { useRouter, useSearchParams } from "next/navigation";
import { searchEvents, sortEventsByDate } from "@/constants/functions";

const initialPagination: EventsPagination = {
  total: 0,
  page: 1,
  limit: 10,
  pages: 0,
  hasNext: false,
  hasPrev: false,
};

const sortOptions = [
  { label: "All", value: "all" },
  { label: "Newest", value: "new" },
  { label: "Oldest", value: "old" },
];

function EventsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const [eventData, setEventData] = useState<Event[]>([]);
  const [pagination, setPagination] = useState<EventsPagination>(initialPagination);
  const [revenueByEventId, setRevenueByEventId] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"all" | "new" | "old">("all");
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvents = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getAllEvents(page, 10);

      if ("error" in res) {
        setError(res.error);
      } else {
        setEventData(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      setError("An error occurred while fetching events");
      console.error("Error fetching events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Real revenue per event, pulled once from the transaction summary
  // endpoint (independent of the events table's own pagination, since
  // the two lists aren't guaranteed to be ordered/paginated the same
  // way) — this replaces what used to be a hardcoded fake amount.
  useEffect(() => {
    const fetchRevenue = async () => {
      const res = await getEventsTransactionSummary(1, 1000);
      if (!("error" in res)) {
        const map: Record<string, number> = {};
        res.data.forEach((summary) => {
          map[summary._id] = summary.totalRevenue;
        });
        setRevenueByEventId(map);
      }
    };
    fetchRevenue();
  }, []);

  const filteredEvents = useMemo(
    () => sortEventsByDate(searchEvents(eventData, searchQuery), sortOrder),
    [eventData, searchQuery, sortOrder]
  );

  const buildPageHref = (page: number) => `?page=${page}`;

  const handleDeleteConfirmed = async () => {
    if (!eventToDelete) return;

    setIsDeleting(true);
    const res = await DeleteEventAction(eventToDelete._id);
    setIsDeleting(false);
    setEventToDelete(null);

    if ("error" in res) {
      alert(res.error || "Failed to delete event");
      return;
    }

    // Refresh the current page after deletion
    fetchEvents(currentPage);
  };

  return (
    <DashboardLayout>
      {/* Heading */}
      <section className="mb-10 flex flex-col lg:flex-row gap-3 lg:gap-0 items-start lg:items-center justify-between">
        <div>
          <h3 className="text-[#F9F7F4] text-2xl font-semibold mb-2">Events</h3>
          <p className="text-[#B3B3B3]">Manage your event portfolio</p>
        </div>
        {/* Create Event Button */}
        <Link
          href="/events/create-event"
          className="flex gap-2 items-center rounded-xl bg-[#cca33a] hover:bg-[#957628] px-4 py-3 font-semibold transition-colors"
        >
          <FaPlus />
          Create Event
        </Link>
      </section>

      {/* Search Function */}
      <section className="flex flex-col lg:flex-row gap-4 mb-10">
        <div className="w-full relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#18181B] w-full p-3 pl-10 rounded-xl border border-[#27272A] placeholder:text-[#6F6F6F] focus:outline-none focus:border-[#CCA33A] transition-colors"
            placeholder="Search events by title, venue, or type..."
          />
          <FiSearch className="absolute top-4 left-3 text-lg text-[#6F6F6F]" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-3 right-3 text-[#6F6F6F] hover:text-[#F9F7F4] transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        <div>
          <SortDropdown
            options={sortOptions}
            placeholder="Sort by"
            onChange={(value) => setSortOrder(value as "all" | "new" | "old")}
          />
        </div>
      </section>

      {searchQuery && (
        <div className="mb-4 text-sm text-[#B3B3B3]">
          Found {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} on
          this page matching &quot;{searchQuery}&quot;
        </div>
      )}

      {/* Events table Section */}
      <section className="mb-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cca33a]"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-red-500 text-center">
              <p className="text-lg font-semibold mb-2">Error Loading Events</p>
              <p className="text-sm text-gray-400">{error}</p>
            </div>
            <button
              onClick={() => fetchEvents(currentPage)}
              className="mt-4 px-6 py-2 bg-[#CCA33A] hover:bg-[#b8922d] rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center">
              {searchQuery ? (
                <>
                  <p className="text-xl font-semibold text-[#F9F7F4] mb-2">
                    No events found
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-[#cca33a] hover:underline"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xl font-semibold text-[#F9F7F4] mb-2">No events yet</p>
                  <p className="text-sm text-[#B3B3B3] mb-6">
                    Create your first event to get started
                  </p>
                  <Link
                    href="/events/create-event"
                    className="inline-flex gap-2 items-center rounded-xl bg-[#cca33a] hover:bg-[#957628] px-6 py-3 font-semibold transition-colors"
                  >
                    <FaPlus />
                    Create Event
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : (
          <EventTable
            events={filteredEvents}
            revenueByEventId={revenueByEventId}
            onView={(event) => router.push(`/events/edit-event?id=${event._id}`)}
            onEdit={(event) => router.push(`/events/edit-event?id=${event._id}`)}
            onAnalytics={(event) => router.push(`/events/event-analytics?id=${event._id}`)}
            onDelete={(event) => setEventToDelete(event)}
          />
        )}
      </section>

      {/* Pagination */}
      {!isLoading && !error && pagination.total > 0 && (
        <section className="mb-20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[#B3B3B3]">
            Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
            {Math.min(currentPage * pagination.limit, pagination.total)} of{" "}
            {pagination.total} events
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

      {/* Delete confirmation modal */}
      {eventToDelete && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0F0F0F] p-6 text-white shadow-2xl">
            <h2 className="mb-2 text-center text-lg font-semibold">
              Delete &quot;{eventToDelete.eventDetails.eventTitle}&quot;?
            </h2>
            <p className="mb-6 text-center text-sm text-white/60">
              This permanently deletes the event. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setEventToDelete(null)}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/5 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function Events() {
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
      <EventsContent />
    </Suspense>
  );
}