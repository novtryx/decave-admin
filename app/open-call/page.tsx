"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import {
  getApplications,
  getOpenCallStats,
  getAllOpenCallCategories,
} from "@/app/actions/openCall";
import {
  ApplicationListItem,
  ApplicationStatus,
  APPLICATION_STATUSES,
  statusLabel,
  OpenCallCategory,
  OpenCallStats,
} from "@/types/openCallType";
import ApplicationDetailModal from "@/components/openCall/ApplicationDetailModal";
import StatusBadge from "@/components/openCall/StatusBadge";

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "—";

export default function OpenCallPage() {
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<OpenCallStats | null>(null);
  const [categories, setCategories] = useState<OpenCallCategory[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [status, setStatus] = useState<ApplicationStatus | "">("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAllOpenCallCategories().then((res) => {
      if (!("error" in res) && res.success) setCategories(res.data);
    });
    getOpenCallStats().then((res) => {
      if (!("error" in res) && res.success) setStats(res.data);
    });
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    const res = await getApplications(
      { search: search || undefined, categorySlug: categorySlug || undefined, status: status || undefined },
      page,
      20
    );
    if ("error" in res) {
      setError(res.error);
      setApplications([]);
    } else if (!res.success) {
      setError("Failed to load applications");
      setApplications([]);
    } else {
      setApplications(res.data.applications);
      setPagination({ total: res.data.total, page: res.data.page, pages: res.data.pages });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, categorySlug, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchApplications();
  };

  const refreshAfterReview = () => {
    setSelectedId(null);
    fetchApplications();
    getOpenCallStats().then((res) => {
      if (!("error" in res) && res.success) setStats(res.data);
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Open Call Applications</h1>
        <p className="text-sm text-[#9F9FA9] mt-1">
          Review, filter, and manage applications for the Afrospook 2026 Open Call.
        </p>
      </div>

      {/* Stat cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Submitted" value={stats.byStatus.submitted} />
          <StatCard label="Under Review" value={stats.byStatus.under_review} />
          <StatCard label="Shortlisted" value={stats.byStatus.shortlisted} />
          <StatCard label="Accepted" value={stats.byStatus.accepted} accent="text-green-400" />
          <StatCard label="Rejected" value={stats.byStatus.rejected} accent="text-red-400" />
        </div>
      )}

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
          value={categorySlug}
          onChange={(e) => {
            setCategorySlug(e.target.value);
            setPage(1);
          }}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as ApplicationStatus | "");
            setPage(1);
          }}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white"
        >
          <option value="">All Statuses</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel(s)}
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
          ) : applications.length === 0 ? (
            <p className="text-center py-20 text-[#9F9FA9]">No applications match these filters.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">Applicant</th>
                  <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">Category</th>
                  <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">Status</th>
                  <th className="p-4 text-sm font-medium text-[#B3B3B3] text-left">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr
                    key={app._id}
                    onClick={() => setSelectedId(app._id)}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                  >
                    <td className="p-4">
                      <p className="text-sm text-[#F4F4F5] font-semibold">{app.applicant.fullName}</p>
                      <p className="text-xs text-[#9F9FA9]">{app.applicant.email}</p>
                    </td>
                    <td className="p-4 text-sm text-[#9F9FA9]">{app.category.name}</td>
                    <td className="p-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="p-4 text-sm text-[#9F9FA9]">{formatDate(app.submittedAt)}</td>
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
            Page {pagination.page} of {pagination.pages} · {pagination.total} applications
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] disabled:opacity-40"
            >
              <MdChevronLeft />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={pagination.page >= pagination.pages}
              className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] disabled:opacity-40"
            >
              <MdChevronRight />
            </button>
          </div>
        </div>
      )}

      <ApplicationDetailModal
        applicationId={selectedId}
        onClose={() => setSelectedId(null)}
        onStatusChanged={refreshAfterReview}
      />
    </DashboardLayout>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
      <p className="text-xs text-[#9F9FA9] mb-1">{label}</p>
      <p className={`text-xl font-bold ${accent || "text-white"}`}>{value}</p>
    </div>
  );
}