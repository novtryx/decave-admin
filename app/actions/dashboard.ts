"use server";
import { protectedFetch } from "@/lib/protectedFetch";
import { Event } from "@/types/eventsType";

interface UpcomingEventsData {
  events: Event[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface MetricData {
  currentMonth: number;
  lastMonth: number;
  percentageChange: number;
  trend: "up" | "down";
  currency?: string;
}

interface RecentActivity {
  _id: string;
  title: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  ageInHours: number;
  id: string;
}

interface RecentActivitiesData {
  activities: RecentActivity[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface DashboardDataType {
  message?: string;
  success: boolean;
  upcomingEvents: UpcomingEventsData;
  ticketSale: MetricData;
  revnue: MetricData;
  activeEvents: MetricData;
  recentActivities: RecentActivitiesData;
  avgTicketPrice: MetricData;
}


export async function getDashboardData(): Promise<DashboardDataType | { error: string }> {
  const res = await protectedFetch<DashboardDataType>("/dashboard", {
    method: "GET",
    timeout: 60000, 
  });
  
  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}

