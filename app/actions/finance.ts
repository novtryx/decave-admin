"use server";

import { protectedFetch } from "@/lib/protectedFetch";
import {
  FinanceEntriesResponse,
  FinanceEntryFilters,
  FinanceEntryInput,
  FinanceEntry,
  EventFinanceSummaryResponse,
  FinanceOverviewResponse,
} from "@/types/financeType";

export async function getFinanceOverview(): Promise<FinanceOverviewResponse | { error: string }> {
  const res = await protectedFetch<FinanceOverviewResponse>(`/finance/overview`, { method: "GET" });
  if (!res.success) return { error: res.error };
  return res.data;
}

export async function getEventFinanceSummary(
  eventId: string
): Promise<EventFinanceSummaryResponse | { error: string }> {
  const res = await protectedFetch<EventFinanceSummaryResponse>(`/finance/events/${eventId}/summary`, {
    method: "GET",
  });
  if (!res.success) return { error: res.error };
  return res.data;
}

export async function getFinanceEntries(
  filters: FinanceEntryFilters = {},
  page: number = 1,
  limit: number = 20
): Promise<FinanceEntriesResponse | { error: string }> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (filters.eventId) params.set("eventId", filters.eventId);
  if (filters.type) params.set("type", filters.type);
  if (filters.category) params.set("category", filters.category);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);

  const res = await protectedFetch<FinanceEntriesResponse>(`/finance/entries?${params.toString()}`, {
    method: "GET",
  });
  if (!res.success) return { error: res.error };
  return res.data;
}

export async function createFinanceEntry(
  input: FinanceEntryInput
): Promise<{ success: boolean; message: string; data?: FinanceEntry } | { error: string }> {
  const res = await protectedFetch<{ success: boolean; message: string; data: FinanceEntry }>(
    `/finance/entries`,
    { method: "POST", body: input }
  );
  if (!res.success) return { error: res.error };
  return res.data;
}

export async function updateFinanceEntry(
  id: string,
  input: Partial<FinanceEntryInput>
): Promise<{ success: boolean; message: string; data?: FinanceEntry } | { error: string }> {
  const res = await protectedFetch<{ success: boolean; message: string; data: FinanceEntry }>(
    `/finance/entries/${id}`,
    { method: "PATCH", body: input }
  );
  if (!res.success) return { error: res.error };
  return res.data;
}

export async function deleteFinanceEntry(
  id: string
): Promise<{ success: boolean; message: string } | { error: string }> {
  const res = await protectedFetch<{ success: boolean; message: string }>(`/finance/entries/${id}`, {
    method: "DELETE",
  });
  if (!res.success) return { error: res.error };
  return res.data;
}