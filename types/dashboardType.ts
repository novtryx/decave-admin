// Dashboard-specific type definitions

import { Event } from "./eventsType";

export type DashboardRange = "month" | "3months" | "year" | "all";

export interface MetricData {
  currentPeriod: number;
  // `null` only when range === "all" — there's no meaningful "all
  // time before all time" to compare against, so the backend omits
  // the comparison entirely rather than faking a 0% change.
  previousPeriod: number | null;
  percentageChange: number | null;
  trend: "up" | "down" | "stable" | null;
  currency?: string;
}

export interface RecentActivity {
  _id: string;
  title: string;
  type: "user_login" | "event_published" | "ticket_sold" | string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  ageInHours: number;
  id: string;
}

export interface DashboardData {
  success: boolean;
  range: DashboardRange;
  upcomingEvents: {
    events: Event[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
  ticketSale: MetricData;
  revnue: MetricData; // Note: API has typo "revnue" instead of "revenue"
  activeEvents: MetricData;
  recentActivities: {
    activities: RecentActivity[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  avgTicketPrice: MetricData;
}