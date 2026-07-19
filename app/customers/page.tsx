"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { FiSearch, FiDownload } from "react-icons/fi";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { getCustomers } from "@/app/actions/crm";
import { getAllEvents } from "@/app/actions/event";
import type { Customer, CustomerFilters } from "@/types/crmType";
import { getTagLabel, AUTO_CUSTOMER_TAGS } from "@/types/crmType";
import type { Event } from "@/types/eventsType";
import CustomerDetailModal from "@/components/customers/CustomerDetailModal";
import { downloadCSVGeneric } from "@/constants/exportGeneric";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(value || 0);

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "—";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 0, hasNext: false, hasPrev: false });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [eventId, setEventId] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState<"" | "checked_in" | "never_checked_in">("");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAllEvents(1, 100).then((res) => {
      if (!("error" in res)) setEvents(res.data);
    });
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);

    const filters: CustomerFilters = {
      search: search || undefined,
      eventId: eventId || undefined,
      attendanceStatus: attendanceStatus || undefined,
      tag: tag || undefined,
    };

    const res = await getCustomers(filters, page, 20);
    if ("error" in res) {
      setError(res.error);
      setCustomers([]);
    } else if (!res.success) {
      setError("Failed to load customers");
      setCustomers([]);
    } else {
      setCustomers(res.data);
      setPagination(res.pagination);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, eventId, attendanceStatus, tag]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  const handleExport = () => {
    const headers = [
      "Full Name",
      "Email",
      "Phone",
      "Total Spend",
      "Tickets Purchased",
      "Events Attended",
      "Checked In",
      "Referral Source",
      "Tags",
      "First Purchase",
      "Last Purchase",
    ];
    const rows = customers.map((c) => [
      c.fullName,
      c.email,
      c.phoneNumber,
      c.totalSpend,
      c.ticketsPurchased,
      c.eventsAttendedCount,
      c.checkedInCount,
      c.referralSource,
      c.tags.join("; "),
      formatDate(c.firstPurchaseDate),
      formatDate(c.lastPurchaseDate),
    ]);
    downloadCSVGeneric(headers, rows, "customers");
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-sm text-[#9F9FA9] mt-1">
            Your buyer database, built from every ticket ever sold — filter, tag, and retarget past
            buyers for the next event.
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={customers.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm hover:bg-[#2a2a2a] disabled:opacity-50 shrink-0"
        >
          <FiDownload /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone…"
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-gray-600"
          />
        </form>

        <select
          value={eventId}
          onChange={(e) => {
            setEventId(e.target.value);
            setPage(1);
          }}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white"
        >
          <option value="">All Events</option>
          {events.map((ev) => (
            <option key={ev._id} value={ev._id}>
              {ev.eventDetails.eventTitle}
            </option>
          ))}
        </select>

        <select
          value={attendanceStatus}
          onChange={(e) => {
            setAttendanceStatus(e.target.value as typeof attendanceStatus);
            setPage(1);
          }}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white"
        >
          <option value="">Any Attendance</option>
          <option value="checked_in">Has Checked In</option>
          <option value="never_checked_in">Never Checked In</option>
        </select>

        <select
          value={tag}
          onChange={(e) => {
            setTag(e.target.value);
            setPage(1);
          }}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white"
        >
          <option value="">All Tags</option>
          {AUTO_CUSTOMER_TAGS.map((t) => (
            <option key={t} value={t}>
              {getTagLabel(t)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="w-full bg-zinc-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#cca33a]" />
            </div>
          ) : error ? (
            <p className="text-center py-20 text-[#9F9FA9]">{error}</p>
          ) : customers.length === 0 ? (
            <p className="text-center py-20 text-[#9F9FA9]">No customers match these filters.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">Buyer</th>
                  <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">Total Spend</th>
                  <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">Events</th>
                  <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">Check-Ins</th>
                  <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">Referral</th>
                  <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">Tags</th>
                  <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">Last Purchase</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.email}
                    onClick={() => setSelectedEmail(customer.email)}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                  >
                    <td className="p-4">
                      <p className="text-sm text-[#F4F4F5] font-semibold">{customer.fullName}</p>
                      <p className="text-xs text-[#9F9FA9]">{customer.email}</p>
                    </td>
                    <td className="p-4 text-sm text-white font-medium">
                      {formatCurrency(customer.totalSpend)}
                    </td>
                    <td className="p-4 text-sm text-[#9F9FA9]">{customer.eventsAttendedCount}</td>
                    <td className="p-4 text-sm text-[#9F9FA9]">
                      {customer.checkedInCount} / {customer.ticketsPurchased}
                    </td>
                    <td className="p-4 text-sm text-[#9F9FA9] capitalize">{customer.referralSource}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {customer.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-xs px-2 py-0.5 rounded-full bg-[#cca33a]/10 text-[#cca33a] border border-[#cca33a]/30"
                          >
                            {getTagLabel(t)}
                          </span>
                        ))}
                        {customer.tags.length > 3 && (
                          <span className="text-xs text-[#6F6F6F]">+{customer.tags.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[#9F9FA9]">{formatDate(customer.lastPurchaseDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-[#6F6F6F]">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrev}
              className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] disabled:opacity-40"
            >
              <MdChevronLeft />
            </button>
            <span className="text-sm text-white">
              {pagination.page} / {pagination.pages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!pagination.hasNext}
              className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] disabled:opacity-40"
            >
              <MdChevronRight />
            </button>
          </div>
        </div>
      )}

      <CustomerDetailModal
        email={selectedEmail}
        onClose={() => setSelectedEmail(null)}
        onTagsSaved={() => {
          setSelectedEmail(null);
          fetchCustomers();
        }}
      />
    </DashboardLayout>
  );
}