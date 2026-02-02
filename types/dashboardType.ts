// Dashboard-specific type definitions

export interface MetricData {
  currentMonth: number;
  lastMonth: number;
  percentageChange: number;
  trend: "up" | "down";
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