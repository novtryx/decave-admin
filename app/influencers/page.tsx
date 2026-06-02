"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LuChevronsUpDown } from "react-icons/lu";
import { AiOutlineEye } from "react-icons/ai";
import { getInfluencers } from "../actions/influencers";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BankAccount {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  verified: boolean;
}

interface Influencer {
  _id: string;
  fullName: string;
  email: string;
  username: string;
  bankAccount: BankAccount | null;
  referralCode: string;
  buyers: number;
  amount: number;
  influencersTakesPercentage: boolean;
  percentage: number;
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
  data: Influencer[];
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

// ─── Sub-components ───────────────────────────────────────────────────────────

const SortableHeader = ({ label }: { label: string }) => (
  <div className="flex items-center gap-1 cursor-pointer select-none whitespace-nowrap">
    <span>{label}</span>
    <LuChevronsUpDown className="w-3.5 h-3.5 text-[#6F6F6F]" />
  </div>
);

const BankBadge = ({ account }: { account: BankAccount | null }) => {
  if (!account) return <span className="text-[#6F6F6F]">—</span>;
  return (
    <div>
      <p className="text-[#D4D4D4] font-medium leading-tight">{account.bankName}</p>
      <p className="text-[#6F6F6F] text-xs mt-0.5">{account.accountNumber}</p>
      {account.verified && (
        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
          <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full" />
          Verified
        </span>
      )}
    </div>
  );
};

const CommissionBadge = ({
  takesPercentage,
  percentage,
}: {
  takesPercentage: boolean;
  percentage: number;
}) =>
  takesPercentage ? (
    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-600/10 text-yellow-500 border border-yellow-600/20">
      {percentage}%
    </span>
  ) : (
    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#27272A] text-[#6F6F6F] border border-[#27272A]">
      Fixed
    </span>
  );

// ─── Summary cards ─────────────────────────────────────────────────────────────

const SUMMARY_CARDS = (meta: Meta, data: Influencer[]) => [
  {
    label: "Total Influencers",
    value: meta.total.toString(),
    icon: "👥",
  },
  {
    label: "Total Buyers Referred",
    value: data.reduce((s, i) => s + i.buyers, 0).toLocaleString(),
    icon: "🛍",
  },
  {
    label: "Total Earnings",
    value: formatCurrency(data.reduce((s, i) => s + i.amount, 0)),
    icon: "💰",
  },
  {
    label: "Verified Banks",
    value: data.filter((i) => i.bankAccount?.verified).length.toString(),
    icon: "🏦",
  },
];


// ─── Page ─────────────────────────────────────────────────────────────────────

const TABLE_HEADERS = [
  "Influencer",
  "Username",
  "Bank Account",
  "Referral Code",
  "Buyers",
  "Earnings",
  "Commission",
  "Joined",
  "Actions",
];

const NON_SORTABLE = new Set(["Actions", "Bank Account"]);

export default function AdminInfluencersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery<ApiResponse>({
    queryKey: ["influencers", page],
    queryFn: () => getInfluencers(page),
  });

  console.log("data==", data);
  
  return (
    <DashboardLayout>
      {/* Header */}
      <section className="mb-8 flex flex-col lg:flex-row gap-3 lg:gap-0 items-start lg:items-center justify-between">
        <div>
          <h3 className="text-[#F9F7F4] text-2xl font-semibold mb-1">All Influencers</h3>
          <p className="text-[#B3B3B3] text-sm">
            {data
              ? `${data.meta.total} total influencer${data.meta.total !== 1 ? "s" : ""}`
              : "Loading..."}
          </p>
        </div>
      </section>

      {/* Summary Cards */}
      {data && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {SUMMARY_CARDS(data.meta, data.data).map(({ label, value, icon }) => (
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
            <p className="text-[#6F6F6F] text-sm">Loading influencers...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <span className="text-red-400 text-xl">!</span>
            </div>
            <div className="text-center">
              <p className="text-[#F9F7F4] font-medium mb-1">Failed to load influencers</p>
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
            <p className="text-[#F9F7F4] font-semibold">No influencers found</p>
            <p className="text-[#B3B3B3] text-sm">Influencers will appear here once registered</p>
          </div>
        ) : (
          <>
            <div className="w-full bg-[#18181B] border border-[#27272A] rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#27272A]">
                    {TABLE_HEADERS.map((h) => (
                      <th key={h} className="p-4 text-left text-[#6F6F6F] font-medium">
                        {NON_SORTABLE.has(h) ? h : <SortableHeader label={h} />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((influencer) => (
                    <tr
                      key={influencer._id}
                      className="border-b border-[#27272A]/60 hover:bg-[#27272A]/30 transition-colors"
                    >
                      {/* Influencer */}
                      <td className="p-4 min-w-[180px]">
                        <p className="text-[#F9F7F4] font-medium leading-tight">
                          {influencer.fullName}
                        </p>
                        <p className="text-[#6F6F6F] text-xs mt-0.5">{influencer.email}</p>
                      </td>

                      {/* Username */}
                      <td className="p-4 text-[#B3B3B3] whitespace-nowrap">
                        @{influencer.username}
                      </td>

                      {/* Bank Account */}
                      <td className="p-4 min-w-[160px]">
                        <BankBadge account={influencer.bankAccount} />
                      </td>

                      {/* Referral Code */}
                      <td className="p-4">
                        <span className="font-mono text-xs bg-[#27272A] text-[#CCA33A] px-2 py-1 rounded-md">
                          {influencer.referralCode}
                        </span>
                      </td>

                      {/* Buyers */}
                      <td className="p-4 text-[#F9F7F4] font-medium">
                        {influencer.buyers.toLocaleString()}
                      </td>

                      {/* Earnings */}
                      <td className="p-4 text-[#F9F7F4] font-medium whitespace-nowrap">
                        {formatCurrency(influencer.amount)}
                      </td>

                      {/* Commission */}
                      <td className="p-4">
                        <CommissionBadge
                          takesPercentage={influencer.influencersTakesPercentage}
                          percentage={influencer.percentage}
                        />
                      </td>

                      {/* Joined */}
                      <td className="p-4 text-[#B3B3B3] whitespace-nowrap">
                        {formatDate(influencer.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <button
                          className="text-[#6F6F6F] hover:text-[#F9F7F4] transition-colors p-1.5 rounded-lg hover:bg-[#27272A]"
                          aria-label="View influencer"
                        >
                          <AiOutlineEye size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.meta.totalPages > 1 && (
              <div className="flex items-center justify-between mt-5 text-sm text-[#B3B3B3]">
                <p>
                  Page {data.meta.page} of {data.meta.totalPages} ·{" "}
                  {data.meta.total} influencer{data.meta.total !== 1 ? "s" : ""}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={!data.meta.hasPrevPage}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 rounded-lg border border-[#27272A] hover:border-[#CCA33A] hover:text-[#CCA33A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: data.meta.totalPages }, (_, i) => i + 1).map((p) => (
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