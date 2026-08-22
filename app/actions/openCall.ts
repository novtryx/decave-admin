"use server";

import { protectedFetch } from "@/lib/protectedFetch";
import type {
  ApplicationStatus,
  ApplicationDetail,
  ApplicationFilters,
  ApplicationsListResponse,
  OpenCallStats,
  OpenCallCategory,
} from "@/types/openCallType";

export async function getApplications(
  filters: ApplicationFilters = {},
  page: number = 1,
  limit: number = 20
): Promise<ApplicationsListResponse | { error: string }> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (filters.categorySlug) params.set("category", filters.categorySlug);
  if (filters.status) params.set("status", filters.status);
  if (filters.search) params.set("search", filters.search);

  const res = await protectedFetch<ApplicationsListResponse>(
    `/admin/open-call/applications?${params.toString()}`,
    { method: "GET" }
  );

  if (!res.success) {
    return { error: res.error };
  }
  return res.data;
}

export async function getApplicationDetail(
  id: string
): Promise<{ success: boolean; data: ApplicationDetail } | { error: string }> {
  const res = await protectedFetch<{ success: boolean; data: ApplicationDetail }>(
    `/admin/open-call/applications/${id}`,
    { method: "GET" }
  );
  if (!res.success) {
    return { error: res.error };
  }
  return res.data;
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  reviewNote?: string
): Promise<{ success: boolean; data: ApplicationDetail } | { error: string }> {
  const res = await protectedFetch<{ success: boolean; data: ApplicationDetail }>(
    `/admin/open-call/applications/${id}/status`,
    {
      method: "PATCH",
      body: { status, ...(reviewNote !== undefined && { reviewNote }) },
    }
  );
  if (!res.success) {
    return { error: res.error };
  }
  return res.data;
}

export async function getOpenCallStats(): Promise<
  { success: boolean; data: OpenCallStats } | { error: string }
> {
  const res = await protectedFetch<{ success: boolean; data: OpenCallStats }>(
    `/admin/open-call/stats`,
    { method: "GET" }
  );
  if (!res.success) {
    return { error: res.error };
  }
  return res.data;
}

export async function getAllOpenCallCategories(): Promise<
  { success: boolean; data: OpenCallCategory[] } | { error: string }
> {
  const res = await protectedFetch<{ success: boolean; data: OpenCallCategory[] }>(
    `/admin/open-call/categories`,
    { method: "GET" }
  );
  if (!res.success) {
    return { error: res.error };
  }
  return res.data;
}