"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { EventTable } from "@/components/events/EventTable";
import { SortDropdown } from "@/components/events/SortDropdown";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { getAllEvents } from "../actions/event";
import { Event } from "@/types/eventsType";

export default function Events() {
  const sampleEvents = [
    {
      id: "1",
      name: "Bass Revolution",
      status: "live",
      date: "Jan 12, 2026",
      location: "The Warehouse, Berlin",
      ticketsSold: 145,
      ticketsTotal: 200,
      revenue: 2000000,
    },
    {
      id: "2",
      name: "Underground Sessions Vol. 3",
      status: "draft",
      date: "Jan 12, 2026",
      location: "The Warehouse, Berlin",
      ticketsSold: 145,
      ticketsTotal: 200,
      revenue: 2000000,
    },
    {
      id: "3",
      name: "Summer Vibes Festival",
      status: "past",
      date: "Jan 12, 2026",
      location: "The Warehouse, Berlin",
      ticketsSold: 200,
      ticketsTotal: 200,
      revenue: 2000000,
    },
    {
      id: "4",
      name: "Tech House Marathon",
      status: "upcoming",
      date: "Jan 12, 2026",
      location: "The Warehouse, Berlin",
      ticketsSold: 145,
      ticketsTotal: 200,
      revenue: 2000000,
    },
    {
      id: "5",
      name: "Jungle Takeover",
      status: "upcoming",
      date: "Jan 12, 2026",
      location: "The Warehouse, Berlin",
      ticketsSold: 145,
      ticketsTotal: 200,
      revenue: 2000000,
    },
  ];
  const [eventData, setEventData] = useState<Event[]>([])

  useEffect(() => {
    const fetchAllEvents = async() => {
      const res = await getAllEvents()

      setEventData(res.data)
    }

    fetchAllEvents()
  }, [])

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
          className="flex gap-2 items-center rounded-xl bg-[#cca33a] hover:bg-[#957628] px-4 py-3 font-semibold"
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
            className="bg-[#18181B] w-full p-3 pl-10 rounded-xl border border-[#27272A] placeholder:text-[#6F6F6F]"
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
        <EventTable
          events={eventData}
          onView={(event) => console.log("View:", event)}
          onEdit={(event) => console.log("Edit:", event)}
          onCopy={(event) => console.log("Copy:", event)}
          onDelete={(event) => console.log("Delete:", event)}
        />
      </section>
    </DashboardLayout>
  );
}
