// "use client";

// import { DashboardLayout } from "@/components/DashboardLayout";
// import { MdOutlineFileDownload } from "react-icons/md";
// import TransactionStats from "./TransactionStats";
// import { FiSearch } from "react-icons/fi";
// import { SortDropdown } from "@/components/events/SortDropdown";
// import {
//   TransactionTable,
//   Transaction,
// } from "@/components/sales-and-transactions/TransactionTable";
// import { useState, useEffect, useMemo, Suspense } from "react";
// import { getAllTransactions } from "../actions/transaction";
// import {
//   searchTransactions,
//   filterTransactionsByStatus,
//   sortTransactionsByDate,
//   filterTransactionsByPeriod,
//   exportTransactions,
// } from "@/constants/functions";
// import { useLoadingStore } from "@/store/LoadingState";
// import { processTransactionsFromAPI } from "@/utils/transaction-helper";
// import { MdChevronLeft, MdChevronRight } from "react-icons/md";
// import { useRouter, useSearchParams } from "next/navigation";

// function SalesAndTransactionsContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
  
//   // Get page from URL, default to 1
//   const currentPage = parseInt(searchParams.get("page") || "1");

//   const { isLoading, startLoading, stopLoading } = useLoadingStore();

//   const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  
//   // Pagination state
//   const [pagination, setPagination] = useState({
//     total: 0,
//     page: 1,
//     limit: 10,
//     pages: 0,
//     hasNext: false,
//     hasPrev: false,
//   });

//   const [error, setError] = useState("");
//   const [showExportMenu, setShowExportMenu] = useState(false);

//   // Filter states
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [sortOrder, setSortOrder] = useState<"all" | "new" | "old">("all");
//   const [periodFilter, setPeriodFilter] = useState<"all" | "this-month" | "last-month">("all");

//   const statusOptions = [
//     { label: "All", value: "all" },
//     { label: "Completed", value: "completed" },
//     { label: "Pending", value: "pending" },
//     { label: "Failed", value: "failed" },
//   ];

//   const sortOptions = [
//     { label: "All", value: "all" },
//     { label: "Newest", value: "new" },
//     { label: "Oldest", value: "old" },
//   ];

//   const periodOptions = [
//     { label: "All Time", value: "all" },
//     { label: "This Month", value: "this-month" },
//     { label: "Last Month", value: "last-month" },
//   ];

//   useEffect(() => {
//     fetchTransactions(currentPage);
//   }, [currentPage]);

//   const fetchTransactions = async (page: number) => {
//     startLoading();
//     setError("");

//     try {
//       const response = await getAllTransactions(page);

//       console.log("API Response:", response);

//       if (response && response.success && Array.isArray(response.data)) {
//         const processedTransactions = processTransactionsFromAPI(response.data);
        
//         console.log("Processed Transactions:", processedTransactions.slice(0, 2));
        
//         setAllTransactions(processedTransactions);
        
//         // Update pagination state
//         if (response.pagination) {
//           setPagination(response.pagination);
//         }
        
//         setError("");
//       } else {
//         setError(response?.message || "Failed to fetch transactions");
//         setAllTransactions([]);
//       }
//     } catch (err) {
//       console.error("Error fetching transactions:", err);
//       setError(
//         err instanceof Error
//           ? err.message
//           : "An error occurred while fetching transactions"
//       );
//       setAllTransactions([]);
//     } finally {
//       stopLoading();
//     }
//   };

//   // Client-side filtering (applied to current page data only)
//   const filteredTransactions = useMemo(() => {
//     let result = allTransactions;

//     result = searchTransactions(result, searchQuery);
//     result = filterTransactionsByStatus(result, statusFilter);
//     result = filterTransactionsByPeriod(result, periodFilter);
//     result = sortTransactionsByDate(result, sortOrder);

//     return result;
//   }, [allTransactions, searchQuery, statusFilter, periodFilter, sortOrder]);

//   const handleExport = (format: "csv" | "excel" | "json") => {
//     const dataToExport =
//       searchQuery || statusFilter !== "all" || periodFilter !== "all"
//         ? filteredTransactions
//         : allTransactions;

//     exportTransactions(dataToExport, format, "sales-transactions");
//     setShowExportMenu(false);
//   };

//   // Pagination handlers - Now update URL query params
//   const handlePreviousPage = () => {
//     if (pagination.hasPrev) {
//       router.push(`?page=${currentPage - 1}`);
//     }
//   };

//   const handleNextPage = () => {
//     if (pagination.hasNext) {
//       router.push(`?page=${currentPage + 1}`);
//     }
//   };

//   const handlePageClick = (page: number) => {
//     router.push(`?page=${page}`);
//   };

//   return (
//     <DashboardLayout>
//       {/* Heading */}
//       <section className="mb-10 flex flex-col lg:flex-row gap-4 lg:gap-0 items-start lg:items-center justify-between">
//         <div>
//           <h3 className="text-[#F9F7F4] text-2xl font-semibold mb-2">
//             Sales and Transactions
//           </h3>
//           <p className="text-[#B3B3B3]">View ticket sales and payment history</p>
//         </div>

//         {/* Export Data Button with Dropdown */}
//         <div className="relative w-full sm:w-fit">
//           <button
//             onClick={() => setShowExportMenu(!showExportMenu)}
//             className="flex gap-2 w-full sm:w-fit justify-center items-center rounded-xl bg-[#cca33a] px-4 py-3 font-semibold hover:bg-[#b8923a] transition-colors"
//             disabled={allTransactions.length === 0}
//           >
//             <MdOutlineFileDownload size={20} />
//             Export Data
//           </button>

//           {/* Export Menu */}
//           {showExportMenu && (
//             <div className="absolute right-0 mt-2 w-48 bg-[#18181B] border border-[#27272A] rounded-xl shadow-lg z-10">
//               <button
//                 onClick={() => handleExport("csv")}
//                 className="w-full text-left px-4 py-3 text-[#F9F7F4] hover:bg-[#27272A] transition-colors rounded-t-xl"
//               >
//                 Export as CSV
//               </button>
//               <button
//                 onClick={() => handleExport("excel")}
//                 className="w-full text-left px-4 py-3 text-[#F9F7F4] hover:bg-[#27272A] transition-colors"
//               >
//                 Export as Excel
//               </button>
//               <button
//                 onClick={() => handleExport("json")}
//                 className="w-full text-left px-4 py-3 text-[#F9F7F4] hover:bg-[#27272A] transition-colors rounded-b-xl"
//               >
//                 Export as JSON
//               </button>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Transaction Stats Section */}
//       <TransactionStats />

//       {/* Search and Filter Section */}
//       <section className="flex flex-col lg:flex-row gap-4 mb-10">
//         <div className="w-full relative">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="bg-[#18181B] w-full p-3 pl-10 rounded-xl border border-[#27272A] placeholder:text-[#6F6F6F] text-[#F9F7F4]"
//             placeholder="Search by event, transaction ID, or email..."
//           />
//           <FiSearch className="absolute top-4 left-3 text-lg text-[#6F6F6F]" />
//           {searchQuery && (
//             <button
//               onClick={() => setSearchQuery("")}
//               className="absolute top-3 right-3 text-[#6F6F6F] hover:text-[#F9F7F4] transition-colors"
//             >
//               ✕
//             </button>
//           )}
//         </div>

//         <div>
//           <SortDropdown
//             options={periodOptions}
//             onChange={(value) =>
//               setPeriodFilter(value as "all" | "this-month" | "last-month")
//             }
//           />
//         </div>

//         <div>
//           <SortDropdown
//             options={sortOptions}
//             placeholder="Sort"
//             onChange={(value) => setSortOrder(value as "all" | "new" | "old")}
//           />
//         </div>

//         <div>
//           <SortDropdown
//             options={statusOptions}
//             placeholder="Status"
//             onChange={(value) => setStatusFilter(value)}
//           />
//         </div>
//       </section>

//       {/* Results Summary */}
//       {searchQuery && (
//         <div className="mb-4 text-sm text-[#B3B3B3]">
//           Found {filteredTransactions.length} transaction
//           {filteredTransactions.length !== 1 ? "s" : ""} on this page
//           {searchQuery && ` matching "${searchQuery}"`}
//         </div>
//       )}

//       {/* Error Message */}
//       {error && (
//         <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 text-sm text-red-500">
//           {error}
//         </div>
//       )}

//       {/* Transaction Table */}
//       <section className="mb-6">
//         {isLoading ? (
//           <div className="flex items-center justify-center py-20">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cca33a]"></div>
//           </div>
//         ) : filteredTransactions.length === 0 && !error ? (
//           <div className="flex flex-col items-center justify-center py-20 text-[#6F6F6F]">
//             <p className="text-lg mb-2">No transactions found</p>
//             {(searchQuery || statusFilter !== "all" || periodFilter !== "all") && (
//               <button
//                 onClick={() => {
//                   setSearchQuery("");
//                   setStatusFilter("all");
//                   setPeriodFilter("all");
//                   setSortOrder("all");
//                 }}
//                 className="mt-4 text-[#cca33a] hover:underline"
//               >
//                 Clear all filters
//               </button>
//             )}
//           </div>
//         ) : (
//           <TransactionTable transactions={filteredTransactions} />
//         )}
//       </section>

//       {/* Pagination Controls */}
//       {!isLoading && allTransactions.length > 0 && (
//         <section className="mb-20 flex flex-col sm:flex-row items-center justify-between gap-4">
//           {/* Pagination Info */}
//           <div className="text-sm text-[#B3B3B3]">
//             Showing {((currentPage - 1) * pagination.limit) + 1} to{" "}
//             {Math.min(currentPage * pagination.limit, pagination.total)} of{" "}
//             {pagination.total} transactions
//           </div>

//           {/* Pagination Buttons */}
//           <div className="flex items-center gap-2">
//             {/* Previous Button */}
//             <button
//               onClick={handlePreviousPage}
//               disabled={!pagination.hasPrev}
//               className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#18181B] border border-[#27272A] text-[#F9F7F4] hover:bg-[#27272A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#18181B]"
//             >
//               <MdChevronLeft size={20} />
//               Previous
//             </button>

//             {/* Page Numbers */}
//             <div className="hidden sm:flex items-center gap-1">
//               {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageClick(page)}
//                   className={`px-3 py-2 rounded-lg transition-colors ${
//                     currentPage === page
//                       ? "bg-[#cca33a] text-black font-semibold"
//                       : "bg-[#18181B] border border-[#27272A] text-[#F9F7F4] hover:bg-[#27272A]"
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}
//             </div>

//             {/* Mobile: Current Page Display */}
//             <div className="sm:hidden px-3 py-2 bg-[#18181B] border border-[#27272A] text-[#F9F7F4] rounded-lg">
//               {currentPage} / {pagination.pages}
//             </div>

//             {/* Next Button */}
//             <button
//               onClick={handleNextPage}
//               disabled={!pagination.hasNext}
//               className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#18181B] border border-[#27272A] text-[#F9F7F4] hover:bg-[#27272A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#18181B]"
//             >
//               Next
//               <MdChevronRight size={20} />
//             </button>
//           </div>
//         </section>
//       )}

//       {/* Click outside to close export menu */}
//       {showExportMenu && (
//         <div
//           className="fixed inset-0 z-0"
//           onClick={() => setShowExportMenu(false)}
//         />
//       )}
//     </DashboardLayout>
//   );
// }

// // Main component with Suspense boundary
// export default function SalesAndTransactions() {
//   return (
//     <Suspense fallback={
//       <DashboardLayout>
//         <div className="flex items-center justify-center py-20">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cca33a]"></div>
//         </div>
//       </DashboardLayout>
//     }>
//       <SalesAndTransactionsContent />
//     </Suspense>
//   );
// }


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
import { useState, useEffect, useMemo, Suspense } from "react";
import { getAllTransactions } from "../actions/transaction";
import {
  searchTransactions,
  filterTransactionsByStatus,
  sortTransactionsByDate,
  filterTransactionsByPeriod,
  exportTransactions,
} from "@/constants/functions";
import { processTransactionsFromAPI } from "@/utils/transaction-helper";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";

function SalesAndTransactionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get page from URL, default to 1
  const currentPage = parseInt(searchParams.get("page") || "1");

  // Local loading state instead of zustand
  const [isLoading, setIsLoading] = useState(false);

  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  });

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
    fetchTransactions(currentPage);
  }, [currentPage]);

  const fetchTransactions = async (page: number) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await getAllTransactions(page);

      console.log("API Response:", response);
      console.log("First transaction buyers:", response.data?.[0]?.buyers);

      if (response && response.success && Array.isArray(response.data)) {
        const processedTransactions = processTransactionsFromAPI(response.data);
        
        console.log("Processed Transactions:", processedTransactions.slice(0, 2));
        
        setAllTransactions(processedTransactions);
        
        // Update pagination state
        if (response.pagination) {
          setPagination(response.pagination);
        }
        
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
      setIsLoading(false);
    }
  };

  // Client-side filtering (applied to current page data only)
  const filteredTransactions = useMemo(() => {
    let result = allTransactions;

    result = searchTransactions(result, searchQuery);
    result = filterTransactionsByStatus(result, statusFilter);
    result = filterTransactionsByPeriod(result, periodFilter);
    result = sortTransactionsByDate(result, sortOrder);

    return result;
  }, [allTransactions, searchQuery, statusFilter, periodFilter, sortOrder]);

  const handleExport = (format: "csv" | "excel" | "json") => {
    const dataToExport =
      searchQuery || statusFilter !== "all" || periodFilter !== "all"
        ? filteredTransactions
        : allTransactions;

    exportTransactions(dataToExport, format, "sales-transactions");
    setShowExportMenu(false);
  };

  // Pagination handlers - Now update URL query params
  const handlePreviousPage = () => {
    if (pagination.hasPrev) {
      router.push(`?page=${currentPage - 1}`);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      router.push(`?page=${currentPage + 1}`);
    }
  };

  const handlePageClick = (page: number) => {
    router.push(`?page=${page}`);
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
        <div className="relative w-full sm:w-fit">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex gap-2 w-full sm:w-fit justify-center items-center rounded-xl bg-[#cca33a] px-4 py-3 font-semibold hover:bg-[#b8923a] transition-colors"
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
          {filteredTransactions.length !== 1 ? "s" : ""} on this page
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
      <section className="mb-6">
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

      {/* Pagination Controls */}
      {!isLoading && allTransactions.length > 0 && (
        <section className="mb-20 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Pagination Info */}
          <div className="text-sm text-[#B3B3B3]">
            Showing {((currentPage - 1) * pagination.limit) + 1} to{" "}
            {Math.min(currentPage * pagination.limit, pagination.total)} of{" "}
            {pagination.total} transactions
          </div>

          {/* Pagination Buttons */}
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={handlePreviousPage}
              disabled={!pagination.hasPrev}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#18181B] border border-[#27272A] text-[#F9F7F4] hover:bg-[#27272A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#18181B]"
            >
              <MdChevronLeft size={20} />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
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

            {/* Mobile: Current Page Display */}
            <div className="sm:hidden px-3 py-2 bg-[#18181B] border border-[#27272A] text-[#F9F7F4] rounded-lg">
              {currentPage} / {pagination.pages}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextPage}
              disabled={!pagination.hasNext}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#18181B] border border-[#27272A] text-[#F9F7F4] hover:bg-[#27272A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#18181B]"
            >
              Next
              <MdChevronRight size={20} />
            </button>
          </div>
        </section>
      )}

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

// Main component with Suspense boundary
export default function SalesAndTransactions() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cca33a]"></div>
        </div>
      </DashboardLayout>
    }>
      <SalesAndTransactionsContent />
    </Suspense>
  );
}