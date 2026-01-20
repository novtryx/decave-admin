"use server";

import { protectedFetch } from "@/lib/protectedFetch";
import { Transaction } from "@/types/transactionsType";

export async function getAllTransactions() {
  try {
    const res = await protectedFetch<{
      message: string;
      success: boolean;
      data: Transaction[];
      pagination?: {
        total: number;
        page: number;
        limit: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>("/transaction", {
      method: "GET",
    });

    console.log("getAllTransactions response:", res); // Debug log

    return res;
  } catch (error) {
    console.error("Server action error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch transactions",
      data: [],
    };
  }
}