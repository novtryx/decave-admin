"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LuChevronsUpDown } from "react-icons/lu";
import { getInfluencersWithdraws, updateInfluencerWithdrawal } from "../actions/influencers";

// ─── Types ────────────────────────────────────────────────────────────────────

type WithdrawalStatus = "pending" | "completed" | "failed";

interface Withdrawal {
  _id: string;
  influencerId: string;
  amount: number;
  status: WithdrawalStatus;
  bankName: string;
  accountNumber: string;
  accountName: string;
  token: string;
  createdAt: string;
  updatedAt: string;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ApiResponse {
  data: Withdrawal[];
  meta: Meta;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number) =>
  `₦${amount.toLocaleString("en-NG")}`;

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });

// ─── Sub-components ───────────────────────────────────────────────────────────

const SortableHeader = ({ label }: { label: string }) => (
  <div className="flex items-center gap-1 cursor-pointer select-none whitespace-nowrap">
    <span>{label}</span>
    <LuChevronsUpDown className="w-3.5 h-3.5 text-[#6F6F6F]" />
  </div>
);

const StatusBadge = ({ status }: { status: WithdrawalStatus }) => {
  const styles: Record<WithdrawalStatus, string> = {
    pending: "bg-yellow-600/10 text-yellow-500 border border-yellow-600/20",
    completed: "bg-green-500/10 text-green-400 border border-green-500/20",
    failed: "bg-red-500/10 text-red-400 border border-red-500/20",
  };
  const dots: Record<WithdrawalStatus, string> = {
    pending: "bg-yellow-500",
    completed: "bg-green-400",
    failed: "bg-red-400",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${dots[status]} ${status === "pending" ? "animate-pulse" : ""}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ─── Summary cards ─────────────────────────────────────────────────────────────

const SUMMARY_CARDS = (data: Withdrawal[], total: number) => {
  const pending = data.filter((w) => w.status === "pending");
  const completed = data.filter((w) => w.status === "completed");

  return [
    {
      label: "Total Requests",
      value: total.toLocaleString(),
      icon: "📋",
    },
    {
      label: "Pending",
      value: pending.length.toLocaleString(),
      icon: "⏳",
      highlight: true,
    },
    {
      label: "Completed (this page)",
      value: formatCurrency(completed.reduce((s, w) => s + w.amount, 0)),
      icon: "✅",
    },
    {
      label: "Pending Amount",
      value: formatCurrency(pending.reduce((s, w) => s + w.amount, 0)),
      icon: "💸",
    },
  ];
};



// ─── Page ─────────────────────────────────────────────────────────────────────

const TABLE_HEADERS = [
  "Account",
  "Bank",
  "Amount",
  "Status",
  "Requested",
  "Actions",
];

const NON_SORTABLE = new Set(["Actions"]);

export default function AdminTransactionsPage() {
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<ApiResponse>({
    queryKey: ["admin-withdrawals", page],
    queryFn: () => getInfluencersWithdraws(page),
  });

  const { mutate: changeStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: WithdrawalStatus }) =>
      updateInfluencerWithdrawal(id, status),
    onSuccess: () => {
      setUpdatingId(null);
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
    },
    onError: () => setUpdatingId(null),
  });

  return (
    <DashboardLayout>
      {/* Header */}
      <section className="mb-8 flex flex-col lg:flex-row gap-3 lg:gap-0 items-start lg:items-center justify-between">
        <div>
          <h3 className="text-[#F9F7F4] text-2xl font-semibold mb-1">
            Withdrawal Requests
          </h3>
          <p className="text-[#B3B3B3] text-sm">
            {data
              ? `${data.meta.total} total request${data.meta.total !== 1 ? "s" : ""} · pending shown first`
              : "Loading..."}
          </p>
        </div>
      </section>

      {/* Summary Cards */}
      {data && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {SUMMARY_CARDS(data.data, data.meta.total).map(
            ({ label, value, icon, highlight }) => (
              <div
                key={label}
                className={`bg-[#18181B] border rounded-xl p-4 flex flex-col gap-2 ${
                  highlight ? "border-yellow-600/30" : "border-[#27272A]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[#6F6F6F] text-xs">{label}</p>
                  <span className="text-base">{icon}</span>
                </div>
                <p
                  className={`text-xl font-semibold ${
                    highlight ? "text-yellow-500" : "text-[#F9F7F4]"
                  }`}
                >
                  {value}
                </p>
              </div>
            )
          )}
        </section>
      )}

      {/* Table */}
      <section className="mb-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#CCA33A]" />
            <p className="text-[#6F6F6F] text-sm">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <span className="text-red-400 text-xl">!</span>
            </div>
            <div className="text-center">
              <p className="text-[#F9F7F4] font-medium mb-1">
                Failed to load transactions
              </p>
              <p className="text-[#6F6F6F] text-sm">
                Something went wrong. Please try again.
              </p>
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
            <p className="text-[#F9F7F4] font-semibold">
              No withdrawal requests
            </p>
            <p className="text-[#B3B3B3] text-sm">
              Requests will appear here once submitted
            </p>
          </div>
        ) : (
          <>
            <div className="w-full bg-[#18181B] border border-[#27272A] rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#27272A]">
                    {TABLE_HEADERS.map((h) => (
                      <th
                        key={h}
                        className="p-4 text-left text-[#6F6F6F] font-medium"
                      >
                        {NON_SORTABLE.has(h) ? (
                          h
                        ) : (
                          <SortableHeader label={h} />
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((withdrawal) => {
                    const isUpdating = updatingId === withdrawal._id;

                    return (
                      <tr
                        key={withdrawal._id}
                        className={`border-b border-[#27272A]/60 hover:bg-[#27272A]/30 transition-colors ${
                          withdrawal.status === "pending"
                            ? "bg-yellow-600/[0.03]"
                            : ""
                        }`}
                      >
                        {/* Account */}
                        <td className="p-4 min-w-[180px]">
                          <p className="text-[#F9F7F4] font-medium leading-tight">
                            {withdrawal.accountName}
                          </p>
                          <p className="text-[#6F6F6F] text-xs mt-0.5 font-mono">
                            {withdrawal.accountNumber}
                          </p>
                        </td>

                        {/* Bank */}
                        <td className="p-4 text-[#B3B3B3] whitespace-nowrap">
                          {withdrawal.bankName}
                        </td>

                        {/* Amount */}
                        <td className="p-4 text-[#F9F7F4] font-semibold whitespace-nowrap">
                          {formatCurrency(withdrawal.amount)}
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <StatusBadge status={withdrawal.status} />
                        </td>

                        {/* Requested */}
                        <td className="p-4 min-w-[130px]">
                          <p className="text-[#B3B3B3]">
                            {formatDate(withdrawal.createdAt)}
                          </p>
                          <p className="text-[#6F6F6F] text-xs mt-0.5">
                            {formatTime(withdrawal.createdAt)}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="p-4">
                          {withdrawal.status === "pending" ? (
                            <div className="flex items-center gap-2">
                              <button
                                disabled={isUpdating}
                                onClick={() => {
                                  setUpdatingId(withdrawal._id);
                                  changeStatus({
                                    id: withdrawal._id,
                                    status: "completed",
                                  });
                                }}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                              >
                                {isUpdating ? (
                                  <>
                                    <span className="animate-spin inline-block w-3 h-3 border border-current border-t-transparent rounded-full" />
                                    <span>Saving...</span>
                                  </>
                                ) : (
                                  "Approve"
                                )}
                              </button>
                              <button
                                disabled={isUpdating}
                                onClick={() => {
                                  setUpdatingId(withdrawal._id);
                                  changeStatus({
                                    id: withdrawal._id,
                                    status: "failed",
                                  });
                                }}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Decline
                              </button>
                            </div>
                          ) : (
                            <span className="text-[#6F6F6F] text-xs">
                              {withdrawal.status === "completed"
                                ? "Approved"
                                : "Declined"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.meta.totalPages > 1 && (
              <div className="flex items-center justify-between mt-5 text-sm text-[#B3B3B3]">
                <p>
                  Page {data.meta.page} of {data.meta.totalPages} ·{" "}
                  {data.meta.total} request
                  {data.meta.total !== 1 ? "s" : ""}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={!data.meta.hasPrevPage}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 rounded-lg border border-[#27272A] hover:border-[#CCA33A] hover:text-[#CCA33A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: data.meta.totalPages },
                    (_, i) => i + 1
                  ).map((p) => (
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
                    disabled={!data.meta.hasNextPage}
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