"use client"

import React from 'react';
import { AiOutlineEye, AiOutlineEdit, AiOutlineCopy, AiOutlineDelete } from 'react-icons/ai';

type EventStatus = 'live' | 'draft' | 'past' | 'upcoming';

export interface Event {
  id: string;
  name: string;
  status: EventStatus;
  date: string;
  location: string;
  ticketsSold: number;
  ticketsTotal: number;
  revenue: number;
}

interface EventTableProps {
  events: Event[];
  onView?: (event: Event) => void;
  onEdit?: (event: Event) => void;
  onCopy?: (event: Event) => void;
  onDelete?: (event: Event) => void;
}

export const EventTable: React.FC<EventTableProps> = ({
  events,
  onView,
  onEdit,
  onCopy,
  onDelete,
}) => {
  const getStatusBadge = (status: EventStatus) => {
    const styles = {
      live: 'bg-green-500/10 text-green-500 border border-green-500/20',
      draft: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
      past: 'bg-gray-600/10 text-gray-400 border border-gray-600/20',
      upcoming: 'bg-yellow-600/10 text-yellow-600 border border-yellow-600/20',
    };

    const labels = {
      live: 'Live',
      draft: 'Draft',
      past: 'Past',
      upcoming: 'UPCOMING',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status === 'live' && (
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
            <th className="text-left p-4 text-gray-400 text-sm font-medium">
              Event Name ⋄
            </th>
            <th className="text-left p-4 text-gray-400 text-sm font-medium">
              Status ⋄
            </th>
            <th className="text-left p-4 text-gray-400 text-sm font-medium">
              Date ⋄
            </th>
            <th className="text-left p-4 text-gray-400 text-sm font-medium">
              Location ⋄
            </th>
            <th className="text-left p-4 text-gray-400 text-sm font-medium">
              Tickets Sold ⋄
            </th>
            <th className="text-left p-4 text-gray-400 text-sm font-medium">
              Revenue ⋄
            </th>
            <th className="text-left p-4 text-gray-400 text-sm font-medium">
              Actions ⋄
            </th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors">
              <td className="p-4 text-white font-medium">{event.name}</td>
              <td className="p-4">{getStatusBadge(event.status)}</td>
              <td className="p-4 text-gray-300">{event.date}</td>
              <td className="p-4 text-gray-300">{event.location}</td>
              <td className="p-4">
                <div className="flex flex-col gap-1">
                  <span className="text-white font-medium">
                    {event.ticketsSold} / {event.ticketsTotal}
                  </span>
                  <div className="w-32 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${getProgressPercentage(event.ticketsSold, event.ticketsTotal)}%` }}
                    ></div>
                  </div>
                </div>
              </td>
              <td className="p-4 text-white font-medium">{formatCurrency(event.revenue)}</td>
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
                  {onEdit && event.status === 'draft' && (
                    <button
                      onClick={() => onEdit(event)}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="Edit event"
                    >
                      <AiOutlineEdit size={18} />
                    </button>
                  )}
                  {onCopy && (event.status === 'upcoming' || event.status === 'draft') && (
                    <button
                      onClick={() => onCopy(event)}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label="Copy event"
                    >
                      <AiOutlineCopy size={18} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(event)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Delete event"
                    >
                      <AiOutlineDelete size={18} />
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
