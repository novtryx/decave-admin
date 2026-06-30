// ==================== ANALYTICS ACTIONS ====================
"use server";

import { protectedFetch } from "@/lib/protectedFetch";
import { DashboardRange } from "@/types/dashboardType";

export interface TicketSalesDetail {
  ticketsSold: number;
  revenue: number;
  eventId: string;
  eventTitle: string;
  ticketTitle: string;
  ticketPrice: number;
  currency: string;
}

export interface TopEventByRevenue {
  eventId: string;
  eventTitle: string;
  revenue: number;
  ticketsSold: number;
}

export interface CheckInStats {
  totalSold: number;
  totalCheckedIn: number;
  checkInRate: number;
  eventsConsidered: number;
}

export interface PaymentHealthStats {
  totalCompleted: number;
  totalPending: number;
  totalFailed: number;
  completionRate: number;
}

export interface InfluencerStats {
  influencerRevenue: number;
  influencerTickets: number;
  organicRevenue: number;
  organicTickets: number;
  influencerRevenueSharePercent: number;
}

export interface TicketSaleWindowStats {
  onSale: number;
  notYetOpen: number;
  closed: number;
  noWindowSet: number;
}

export interface MetricWithChange {
  value: number;
  changePercent: number | null;
}

export interface TrendPoint {
  label: string;
  revenue: number;
  tickets: number;
}

export interface AnalyticsData {
  range: DashboardRange;
  totalEvents: number;
  totalTickets: number;
  totalRevenue: number;
  totalPublishedEvents: number;
  totalCompletedTransactions: number;
  avgOrderValue: number;
  avgTicketsPerOrder: number;
  ticketSalesDetails: TicketSalesDetail[];
  topEventsByRevenue: TopEventByRevenue[];
  checkInStats: CheckInStats;
  paymentHealth: PaymentHealthStats;
  influencerStats: InfluencerStats;
  ticketSaleWindowStats: TicketSaleWindowStats;
  revenue: MetricWithChange;
  tickets: MetricWithChange;
  conversion: MetricWithChange;
  trend: TrendPoint[];
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
}

export async function getAnalytics(
  range: DashboardRange = "all"
): Promise<AnalyticsResponse | { error: string }> {
  const res = await protectedFetch<AnalyticsResponse>(`/analytics?range=${range}`, {
    method: "GET",
  });

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}