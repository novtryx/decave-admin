"use server";

import { protectedFetch } from "@/lib/protectedFetch";
import { Transaction } from "@/types/transactionsType";

interface TransactionsResponse {
  message: string;
  success: boolean;
  data: Transaction[];
  stats?: {
    totalRevenue: number;
    totalPending: number;
    totalFailed: number;
    totalCompleted: number;
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ✅ Remove try-catch and add proper return type
export async function getAllTransactions(
  page: number = 1,
  limit: number = 10
): Promise<TransactionsResponse | { error: string }> {
  const res = await protectedFetch<TransactionsResponse>(
    `/transaction?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}