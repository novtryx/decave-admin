"use server";

import { protectedFetch } from "@/lib/protectedFetch";
import {
  EventTransactionSummary,
  EventTransactionDetailEvent,
  EventTransactionTotals,
  Transaction,
  TransactionPagination,
} from "@/types/transactionsType";

interface EventsTransactionSummaryResponse {
  message: string;
  success: boolean;
  data: EventTransactionSummary[];
  pagination: TransactionPagination;
}

interface EventTransactionHistoryResponse {
  message: string;
  success: boolean;
  event: EventTransactionDetailEvent;
  data: Transaction[];
  stats: EventTransactionTotals;
  pagination: TransactionPagination;
}

// Landing view — every event with its transaction summary
export async function getEventsTransactionSummary(
  page: number = 1,
  limit: number = 10
): Promise<EventsTransactionSummaryResponse | { error: string }> {
  const res = await protectedFetch<EventsTransactionSummaryResponse>(
    `/transaction/events?page=${page}&limit=${limit}`,
    { method: "GET" }
  );

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}

// Drill-down view — transactions for a single event
export async function getEventTransactionHistory(
  eventId: string,
  page: number = 1,
  limit: number = 10
): Promise<EventTransactionHistoryResponse | { error: string }> {
  const res = await protectedFetch<EventTransactionHistoryResponse>(
    `/transaction/events/${eventId}?page=${page}&limit=${limit}`,
    { method: "GET" }
  );

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}