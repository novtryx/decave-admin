import { create } from "zustand";
import { getAllTransactions } from "@/app/actions/transaction";
import { Transaction, TransactionPagination } from "@/types/transactionsType";
import { processTransactionsFromAPI } from "@/utils/transaction-helper";

interface TransactionStats {
  totalRevenue: number;
  completedCount: number;
  pendingCount: number;
  failedCount: number;
}

interface TransactionStore {
  // State
  transactions: Transaction[];
  pagination: TransactionPagination;
  stats: TransactionStats;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTransactions: (page: number, limit?: number) => Promise<void>;
  clearError: () => void;
  resetStore: () => void;
}

const initialPagination: TransactionPagination = {
  total: 0,
  page: 1,
  limit: 10,
  pages: 0,
  hasNext: false,
  hasPrev: false,
};

const initialStats: TransactionStats = {
  totalRevenue: 0,
  completedCount: 0,
  pendingCount: 0,
  failedCount: 0,
};

export const useTransactionStore = create<TransactionStore>((set) => ({
  // Initial state
  transactions: [],
  pagination: initialPagination,
  stats: initialStats,
  loading: false,
  error: null,

  // Fetch transactions with pagination
  fetchTransactions: async (page: number, limit: number = 10) => {
    set({ loading: true, error: null });

    try {
      const response = await getAllTransactions(page, limit);

      if ('error' in response) {
        set({ 
          error: response.error, 
          loading: false,
          transactions: [],
        });
        return;
      }

      // Process transactions
      const processedTransactions = Array.isArray(response.data)
        ? processTransactionsFromAPI(response.data)
        : [];

      // Extract stats from API response
      const stats: TransactionStats = {
        totalRevenue: response.stats?.totalRevenue || 0,
        completedCount: response.stats?.totalCompleted || 0,
        pendingCount: response.stats?.totalPending || 0,
        failedCount: response.stats?.totalFailed || 0,
      };

      set({
        transactions: processedTransactions,
        pagination: response.pagination || initialPagination,
        stats,
        loading: false,
        error: null,
      });
    } catch (err) {
      set({
        error: err instanceof Error 
          ? err.message 
          : "An error occurred while fetching transactions",
        loading: false,
        transactions: [],
      });
      console.error("Error fetching transactions:", err);
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store to initial state
  resetStore: () => set({
    transactions: [],
    pagination: initialPagination,
    stats: initialStats,
    loading: false,
    error: null,
  }),
}));