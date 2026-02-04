// "use server";

// import { protectedFetch } from "@/lib/protectedFetch";

// /* =======================
//    Ticket sales breakdown
// ======================= */
// export interface TicketSalesDetail {
//   ticketsSold: number;
//   revenue: number;
//   eventId: string;
//   eventTitle: string;
//   ticketPrice: number;
// }

// /* =======================
//    Generic metric structure
// ======================= */
// export interface MetricWithChange {
//   value: number;
//   changePercent: number;
// }

// /* =======================
//    Analytics response data
// ======================= */
// export interface AnalyticsData {
//   totalEvents: number;
//   totalTickets: number;
//   totalRevenue: number;
//   totalPublishedEvents: number;

//   ticketSalesDetails: TicketSalesDetail[];

//   monthRevenue: Record<string, number>; // e.g. { "2026-1": 2875000 }
//   monthTickets: Record<string, number>; // e.g. { "2026-1": 115 }

//   revenueThisMonth: MetricWithChange;
//   ticketsThisMonth: MetricWithChange;

//   yearRevenue: Record<string, number>; // e.g. { "2026": 3275000 }
//   yearTickets: Record<string, number>; // e.g. { "2026": 171 }

//   revenueThisYear: MetricWithChange;
//   ticketsThisYear: MetricWithChange;

//   conversionThisMonth: MetricWithChange;
//   conversionThisYear: MetricWithChange;
// }

// /* =======================
//    API response wrapper
// ======================= */
// export interface AnalyticsResponse {
//   success: boolean;
//   data: AnalyticsData;
// }

// /* =======================
//    Server Action
// ======================= */
// export async function getAnalytics() {
//   const res = await protectedFetch<AnalyticsResponse>("/analytics", {
//     method: "GET",
//   });

//   return res;
// }



// ==================== ANALYTICS ACTIONS ====================
"use server";

import { protectedFetch } from "@/lib/protectedFetch";

export interface TicketSalesDetail {
  ticketsSold: number;
  revenue: number;
  eventId: string;
  eventTitle: string;
  ticketPrice: number;
}

export interface MetricWithChange {
  value: number;
  changePercent: number;
}

export interface AnalyticsData {
  totalEvents: number;
  totalTickets: number;
  totalRevenue: number;
  totalPublishedEvents: number;
  ticketSalesDetails: TicketSalesDetail[];
  monthRevenue: Record<string, number>;
  monthTickets: Record<string, number>;
  revenueThisMonth: MetricWithChange;
  ticketsThisMonth: MetricWithChange;
  yearRevenue: Record<string, number>;
  yearTickets: Record<string, number>;
  revenueThisYear: MetricWithChange;
  ticketsThisYear: MetricWithChange;
  conversionThisMonth: MetricWithChange;
  conversionThisYear: MetricWithChange;
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
}

// ✅ Add return type with error handling
export async function getAnalytics(): Promise<AnalyticsResponse | { error: string }> {
  const res = await protectedFetch<AnalyticsResponse>("/analytics", {
    method: "GET",
  });

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}