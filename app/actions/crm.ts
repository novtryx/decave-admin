"use server";

import { protectedFetch } from "@/lib/protectedFetch";
import {
  CustomersResponse,
  CustomerDetailResponse,
  CustomerFilters,
} from "@/types/crmType";

export async function getCustomers(
  filters: CustomerFilters = {},
  page: number = 1,
  limit: number = 20
): Promise<CustomersResponse | { error: string }> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });

  if (filters.search) params.set("search", filters.search);
  if (filters.eventId) params.set("eventId", filters.eventId);
  if (filters.ticketTierCategory) params.set("ticketTierCategory", filters.ticketTierCategory);
  if (filters.minSpend !== undefined) params.set("minSpend", String(filters.minSpend));
  if (filters.maxSpend !== undefined) params.set("maxSpend", String(filters.maxSpend));
  if (filters.attendanceStatus) params.set("attendanceStatus", filters.attendanceStatus);
  if (filters.tag) params.set("tag", filters.tag);

  const res = await protectedFetch<CustomersResponse>(`/crm/customers?${params.toString()}`, {
    method: "GET",
  });

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}

export async function getCustomerDetail(
  email: string
): Promise<CustomerDetailResponse | { error: string }> {
  const res = await protectedFetch<CustomerDetailResponse>(
    `/crm/customers/${encodeURIComponent(email)}`,
    { method: "GET" }
  );

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}

export async function setCustomerTags(
  email: string,
  tags: string[],
  notes?: string
): Promise<{ success: boolean; message: string } | { error: string }> {
  const res = await protectedFetch<{ success: boolean; message: string }>(
    `/crm/customers/${encodeURIComponent(email)}/tags`,
    { method: "PATCH", body: { tags, notes } }
  );

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}