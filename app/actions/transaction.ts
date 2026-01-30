"use server";

import { protectedFetch } from "@/lib/protectedFetch";
import { Transaction } from "@/types/transactionsType";

export async function getAllTransactions(page: number = 1, limit: number = 10) {
  try {
    const res = await protectedFetch<{
      message: string;
      success: boolean;
      data: Transaction[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>(`/transaction?page=${page}&limit=${limit}`, {
      method: "GET",
    });

    console.log("getAllTransactions response:", res);

    return res;
  } catch (error) {
    console.error("Server action error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch transactions",
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}