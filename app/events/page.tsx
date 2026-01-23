"use client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { EventTable } from "@/components/events/EventTable";
import { SortDropdown } from "@/components/events/SortDropdown";
import Spinner from "@/components/Spinner"; // Update path as needed
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { getAllEvents } from "../actions/event";
import { Event } from "@/types/eventsType";
import { useRouter } from "next/navigation";

export default function Events() {
  const [eventData, setEventData] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await getAllEvents();
        
        if (res.success && res.data) {
          setEventData(res.data);
        } else {
          setError(res.message || "Failed to fetch events");
        }
      } catch (err) {
        setError("An error occurred while fetching events");
        console.error("Error fetching events:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllEvents();
  }, []);

  const sortOptions = [
    { label: "All", value: "all" },
    { label: "Newest", value: "new" },
    { label: "Oldest", value: "old" },
  ];

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
            className="bg-[#18181B] w-full p-3 pl-10 rounded-xl border border-[#27272A] placeholder:text-[#6F6F6F] focus:outline-none focus:border-[#CCA33A] transition-colors"
            placeholder="Search events..."
          />
          <FiSearch className="absolute top-4 left-3 text-lg text-[#6F6F6F]" />
        </div>
        <div>
          <SortDropdown
            options={sortOptions}
            placeholder="Sort by"
            onChange={(value) => console.log("Sorted by:", value)}
          />
        </div>
      </section>

      {/* Events table Section */}
      <section className="mb-40">
        {isLoading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner size="xl" />
            <p className="text-[#B3B3B3] mt-4">Loading events...</p>
          </div>
        ) : error ? (
          // Error State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-red-500 text-center">
              <p className="text-lg font-semibold mb-2">Error Loading Events</p>
              <p className="text-sm text-gray-400">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-[#CCA33A] hover:bg-[#b8922d] rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : eventData.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center">
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
            </div>
          </div>
        ) : (
          // Events Table
          <EventTable
            events={eventData}
            onView={(event) => console.log("View:", event)}
            onEdit={(event) => router.push(`/events/edit-event?id=${event._id}`)}
            onCopy={(event) => console.log("Copy:", event)}
            onDelete={(event) => console.log("Delete:", event)}
          />
        )}
      </section>
    </DashboardLayout>
  );
}