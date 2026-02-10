"use client";

import {
  calculateTotalTickets,
  formatDate,
  getEventStatus,
} from "@/constants/functions";
import { Event } from "@/types/eventsType";
import React from "react";
import { AiOutlineEye } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { LuChevronsUpDown } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbCopy } from "react-icons/tb";

type EventStatus = "live" | "draft" | "past" | "upcoming";

interface EventTableProps {
  events: Event[];
  onView?: (event: Event) => void;
  onEdit?: (event: Event) => void;
  onCopy?: (event: Event) => void;
  onDelete?: (event: Event) => void;
}

const SortableHeader = ({ label }: { label: string }) => (
  <div className="flex items-center gap-1 cursor-pointer select-none">
    <span>{label}</span>
    <LuChevronsUpDown className="w-4 h-4 text-gray-500" />
  </div>
);

export const EventTable: React.FC<EventTableProps> = ({
  events,
  onView,
  onEdit,
  onCopy,
  onDelete,
}) => {
  const getStatusBadge = (status: EventStatus) => {
    const styles = {
      live: "bg-green-500/10 text-green-500 border border-green-500/20",
      draft: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
      past: "bg-gray-600/10 text-gray-400 border border-gray-600/20",
      upcoming: "bg-yellow-600/10 text-yellow-600 border border-yellow-600/20",
    };

    const labels = {
      live: "Live",
      draft: "Draft",
      past: "Past",
      upcoming: "UPCOMING",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {status === "live" && (
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
        )}
        {labels[status]}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const getProgressPercentage = (sold: number, total: number) => {
    return (sold / total) * 100;
  };

  return (
    <div className="w-full bg-[#1a1a1a] rounded-lg overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="p-4 text-gray-400 text-sm font-medium">
              <SortableHeader label="Event Name" />
            </th>
            <th className="p-4 text-gray-400 text-sm font-medium">
              <SortableHeader label="Status" />
            </th>
            <th className="p-4 text-gray-400 text-sm font-medium">
              <SortableHeader label="Date" />
            </th>
            <th className="p-4 text-gray-400 text-sm font-medium">
              <SortableHeader label="Location" />
            </th>
            <th className="p-4 text-gray-400 text-sm font-medium">
              <SortableHeader label="Tickets Sold" />
            </th>
            <th className="p-4 text-gray-400 text-sm font-medium">
              <SortableHeader label="Revenue" />
            </th>
            <th className="p-4 text-gray-400 text-sm font-medium">
              <SortableHeader label="Actions" />
            </th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr
              key={event._id}
              className="border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors"
            >
              <td className="p-4 text-white font-medium">
                {event.eventDetails.eventTitle}
              </td>
              <td className="p-4">{getStatusBadge(getEventStatus(event))}</td>
              <td className="p-4 text-gray-300">
                {formatDate(event.eventDetails.endDate)}
              </td>
              <td className="p-4 text-gray-300">{event.eventDetails.venue}</td>
              <td className="p-4">
                <div className="flex flex-col gap-1">
                  <span className="text-white font-medium">
                    {calculateTotalTickets(event.tickets).totalSoldTickets} /{" "}
                    {calculateTotalTickets(event.tickets).totalInitialTickets}
                  </span>
                  <div className="w-32 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{
                        width: `${getProgressPercentage(calculateTotalTickets(event.tickets).totalSoldTickets, calculateTotalTickets(event.tickets).totalInitialTickets)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </td>
              {/* <td className="p-4 text-white font-medium">{formatCurrency(event.revenue)}</td> */}
              <td className="p-4 text-white font-medium">{"#20,000"}</td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  {onView && (
                    <button
                      onClick={() => onView(event)}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="View event"
                    >
                      <AiOutlineEye size={18} />
                    </button>
                  )}
                  {/* {onEdit && getEventStatus(event) === 'draft' && (
                    <button
                      onClick={() => onEdit(event)}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="Edit event"
                    >
                      <FiEdit2 size={18} />
                    </button>
                  )} */}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(event)}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="Edit event"
                    >
                      <FiEdit2 size={18} />
                    </button>
                  )}
                  {onCopy &&
                    (getEventStatus(event) === "upcoming" ||
                      getEventStatus(event) === "draft") && (
                      <button
                        onClick={() => onCopy(event)}
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Copy event"
                      >
                        <TbCopy size={18} />
                      </button>
                    )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(event)}
                      className="text-[#EF4444] transition-colors"
                      aria-label="Delete event"
                    >
                      <RiDeleteBin6Line size={18} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
