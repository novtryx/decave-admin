"use server";
import { protectedFetch } from "@/lib/protectedFetch";
import { DashboardData, DashboardRange } from "@/types/dashboardType";

export async function getDashboardData(
  range: DashboardRange = "all"
): Promise<DashboardData | { error: string }> {
  const res = await protectedFetch<DashboardData>(`/dashboard?range=${range}`, {
    method: "GET",
    timeout: 60000,
  });

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}