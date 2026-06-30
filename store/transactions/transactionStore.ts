import { create } from "zustand";
import {
  getEventsTransactionSummary,
  getEventTransactionHistory,
} from "@/app/actions/transaction";
import {
  EventTransactionSummary,
  EventTransactionDetailEvent,
  EventTransactionTotals,
  Transaction,
  TransactionPagination,
} from "@/types/transactionsType";

const initialPagination: TransactionPagination = {
  total: 0,
  page: 1,
  limit: 10,
  pages: 0,
  hasNext: false,
  hasPrev: false,
};

const initialTotals: EventTransactionTotals = {
  totalRevenue: 0,
  totalPending: 0,
  totalFailed: 0,
  totalCompleted: 0,
  totalCheckedIn: 0,
};

interface TransactionStore {
  // --- Landing view: events with transaction summaries ---
  eventSummaries: EventTransactionSummary[];
  summaryPagination: TransactionPagination;
  summaryLoading: boolean;
  summaryError: string | null;
  fetchEventSummaries: (page?: number, limit?: number) => Promise<void>;

  // --- Drill-down view: transactions for a single event ---
  selectedEvent: EventTransactionDetailEvent | null;
  transactions: Transaction[];
  totals: EventTransactionTotals;
  transactionsPagination: TransactionPagination;
  detailLoading: boolean;
  detailError: string | null;
  fetchEventTransactions: (
    eventId: string,
    page?: number,
    limit?: number
  ) => Promise<void>;
  clearSelectedEvent: () => void;

  clearErrors: () => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  // Landing view state
  eventSummaries: [],
  summaryPagination: initialPagination,
  summaryLoading: false,
  summaryError: null,

  fetchEventSummaries: async (page: number = 1, limit: number = 10) => {
    set({ summaryLoading: true, summaryError: null });

    try {
      const response = await getEventsTransactionSummary(page, limit);

      if ("error" in response) {
        set({
          summaryError: response.error,
          summaryLoading: false,
          eventSummaries: [],
        });
        return;
      }

      set({
        eventSummaries: response.data,
        summaryPagination: response.pagination,
        summaryLoading: false,
        summaryError: null,
      });
    } catch (err) {
      set({
        summaryError:
          err instanceof Error
            ? err.message
            : "An error occurred while fetching events",
        summaryLoading: false,
        eventSummaries: [],
      });
      console.error("Error fetching event transaction summaries:", err);
    }
  },

  // Drill-down view state
  selectedEvent: null,
  transactions: [],
  totals: initialTotals,
  transactionsPagination: initialPagination,
  detailLoading: false,
  detailError: null,

  fetchEventTransactions: async (
    eventId: string,
    page: number = 1,
    limit: number = 10
  ) => {
    set({ detailLoading: true, detailError: null });

    try {
      const response = await getEventTransactionHistory(eventId, page, limit);

      if ("error" in response) {
        set({
          detailError: response.error,
          detailLoading: false,
          transactions: [],
        });
        return;
      }

      set({
        selectedEvent: response.event,
        transactions: response.data,
        totals: response.stats,
        transactionsPagination: response.pagination,
        detailLoading: false,
        detailError: null,
      });
    } catch (err) {
      set({
        detailError:
          err instanceof Error
            ? err.message
            : "An error occurred while fetching transactions",
        detailLoading: false,
        transactions: [],
      });
      console.error("Error fetching event transactions:", err);
    }
  },

  clearSelectedEvent: () =>
    set({
      selectedEvent: null,
      transactions: [],
      totals: initialTotals,
      transactionsPagination: initialPagination,
      detailError: null,
    }),

  clearErrors: () => set({ summaryError: null, detailError: null }),
}));