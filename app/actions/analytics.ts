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

// ==================== EVENT-LEVEL ANALYTICS ====================

export type SaleWindowStatus = "on_sale" | "not_yet_open" | "closed" | "no_window_set";

export interface TierBreakdownItem {
  ticketId: string;
  ticketName: string;
  tierCategory: string;
  price: number;
  currency: string;
  initialQuantity: number;
  availableQuantity: number;
  ticketsSold: number;
  revenue: number;
  soldPercent: number;
  checkedIn: number;
  pending: number;
  refunded: number;
  cancelled: number;
  saleWindowStatus: SaleWindowStatus;
  salesVelocityPerDay: number;
  unsoldInventoryFlag: boolean;
  recommendNextPhase: string | null;
}

export interface DailySalesTrendPoint {
  date: string;
  ticketsSold: number;
  revenue: number;
}

export interface EventAnalyticsData {
  eventId: string;
  eventTitle: string;
  eventBanner: string;
  published: boolean;
  startDate: string;
  endDate: string;
  totalTicketsCreated: number;
  totalTicketsSold: number;
  totalTicketsRemaining: number;
  totalRevenue: number;
  tierBreakdown: TierBreakdownItem[];
  dailySalesTrend: DailySalesTrendPoint[];
  peakSaleDay: DailySalesTrendPoint | null;
  noShowRate: number;
  checkInRate: number;
  totalCheckedIn: number;
}

interface EventAnalyticsResponse {
  success: boolean;
  data: EventAnalyticsData;
}

interface CompareEventAnalyticsResponse {
  success: boolean;
  data: EventAnalyticsData[];
}

export async function getEventAnalytics(
  eventId: string
): Promise<EventAnalyticsResponse | { error: string }> {
  const res = await protectedFetch<EventAnalyticsResponse>(`/analytics/events/${eventId}`, {
    method: "GET",
  });

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}

export async function compareEventAnalytics(
  eventIds: string[]
): Promise<CompareEventAnalyticsResponse | { error: string }> {
  const res = await protectedFetch<CompareEventAnalyticsResponse>(
    `/analytics/events/compare?ids=${eventIds.join(",")}`,
    { method: "GET" }
  );

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}