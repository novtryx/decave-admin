"use server";

import { protectedFetch } from "@/lib/protectedFetch";
import {
  EventTransactionSummary,
  EventTransactionDetailEvent,
  EventTransactionTotals,
  Transaction,
  TransactionPagination,
  PendingAgingResponse,
  AbandonedCheckoutsResponse,
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
// Pending payment aging buckets — 5m / 1h / 6h / 24h / expired
export async function getPendingPaymentAging(): Promise<
  PendingAgingResponse | { error: string }
> {
  const res = await protectedFetch<PendingAgingResponse>(`/transaction/pending-aging`, {
    method: "GET",
  });

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}

// Abandoned checkout recovery list — pending past the threshold
export async function getAbandonedCheckouts(
  page: number = 1,
  limit: number = 20,
  thresholdMinutes: number = 30
): Promise<AbandonedCheckoutsResponse | { error: string }> {
  const res = await protectedFetch<AbandonedCheckoutsResponse>(
    `/transaction/abandoned?page=${page}&limit=${limit}&thresholdMinutes=${thresholdMinutes}`,
    { method: "GET" }
  );

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}

// Mark a pending/failed transaction as paid (e.g. confirmed bank transfer)
export async function manuallyVerifyTransaction(
  transactionId: string,
  payload: { note?: string; paymentChannel?: string }
): Promise<{ success: boolean; message: string; data?: Transaction } | { error: string }> {
  const res = await protectedFetch<{ success: boolean; message: string; data: Transaction }>(
    `/transaction/${transactionId}/manual-verify`,
    { method: "PATCH", body: payload }
  );

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}

// Refund a completed/manually-verified transaction
export async function refundTransaction(
  transactionId: string,
  payload: { amount?: number; reason?: string; restock?: boolean }
): Promise<{ success: boolean; message: string; data?: Transaction } | { error: string }> {
  const res = await protectedFetch<{ success: boolean; message: string; data: Transaction }>(
    `/transaction/${transactionId}/refund`,
    { method: "PATCH", body: payload }
  );

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}

// Cancel a pending/failed transaction
export async function cancelTransaction(
  transactionId: string,
  payload: { reason?: string }
): Promise<{ success: boolean; message: string; data?: Transaction } | { error: string }> {
  const res = await protectedFetch<{ success: boolean; message: string; data: Transaction }>(
    `/transaction/${transactionId}/cancel`,
    { method: "PATCH", body: payload }
  );

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}