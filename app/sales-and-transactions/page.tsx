"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { MdOutlineFileDownload } from "react-icons/md";
import TransactionStats from "./TransactionStats";
import { FiSearch } from "react-icons/fi";
import { SortDropdown } from "@/components/events/SortDropdown";
import {
  TransactionTable,
  Transaction,
} from "@/components/sales-and-transactions/TransactionTable";
import { useState, useEffect, useMemo } from "react";
import { getAllTransactions } from "../actions/transaction";
import {
  searchTransactions,
  filterTransactionsByStatus,
  sortTransactionsByDate,
  filterTransactionsByPeriod,
  exportTransactions,
} from "@/constants/functions";
import { useLoadingStore } from "@/store/LoadingState";

export default function SalesAndTransactions() {
  // Zustand loading state
  const { isLoading, startLoading, stopLoading } = useLoadingStore();

  // Original data from API
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  // UI state
  const [error, setError] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"all" | "new" | "old">("all");
  const [periodFilter, setPeriodFilter] = useState<"all" | "this-month" | "last-month">("all");

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

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    startLoading();
    setError("");

    try {
      const response = await getAllTransactions();

      console.log("API Response:", response);

      if (response && response.success && Array.isArray(response.data)) {
        setAllTransactions(response.data);
        setError("");
      } else {
        setError(response?.message || "Failed to fetch transactions");
        setAllTransactions([]);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching transactions"
      );
      setAllTransactions([]);
    } finally {
      stopLoading();
    }
  };

  // Apply all filters using useMemo for performance
  const filteredTransactions = useMemo(() => {
    let result = allTransactions;

    // Apply search
    result = searchTransactions(result, searchQuery);

    // Apply status filter
    result = filterTransactionsByStatus(result, statusFilter);

    // Apply period filter
    result = filterTransactionsByPeriod(result, periodFilter);

    // Apply sorting
    result = sortTransactionsByDate(result, sortOrder);

    return result;
  }, [allTransactions, searchQuery, statusFilter, periodFilter, sortOrder]);

  // Handle export
  const handleExport = (format: "csv" | "excel" | "json") => {
    // Use filtered transactions if any filters are active, otherwise use all
    const dataToExport =
      searchQuery || statusFilter !== "all" || periodFilter !== "all"
        ? filteredTransactions
        : allTransactions;

    exportTransactions(dataToExport, format, "sales-transactions");
    setShowExportMenu(false);
  };

  return (
    <DashboardLayout>
      {/* Heading */}
      <section className="mb-10 flex flex-col lg:flex-row gap-4 lg:gap-0 items-start lg:items-center justify-between">
        <div>
          <h3 className="text-[#F9F7F4] text-2xl font-semibold mb-2">
            Sales and Transactions
          </h3>
          <p className="text-[#B3B3B3]">View ticket sales and payment history</p>
        </div>

        {/* Export Data Button with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex gap-2 items-center rounded-xl bg-[#cca33a] px-4 py-3 font-semibold hover:bg-[#b8923a] transition-colors"
            disabled={allTransactions.length === 0}
          >
            <MdOutlineFileDownload size={20} />
            Export Data
          </button>

          {/* Export Menu */}
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
      </section>

      {/* Transaction Stats Section */}
      <TransactionStats />

      {/* Search and Filter Section */}
      <section className="flex flex-col lg:flex-row gap-4 mb-10">
        <div className="w-full relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#18181B] w-full p-3 pl-10 rounded-xl border border-[#27272A] placeholder:text-[#6F6F6F] text-[#F9F7F4]"
            placeholder="Search by event, transaction ID, or email..."
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
      </section>

      {/* Results Summary */}
      {searchQuery && (
        <div className="mb-4 text-sm text-[#B3B3B3]">
          Found {filteredTransactions.length} transaction
          {filteredTransactions.length !== 1 ? "s" : ""}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Transaction Table */}
      <section className="mb-20">
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

      {/* Click outside to close export menu */}
      {showExportMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowExportMenu(false)}
        />
      )}
    </DashboardLayout>
  );
}