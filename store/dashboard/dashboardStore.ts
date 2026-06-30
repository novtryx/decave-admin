import { create } from 'zustand';
import { getDashboardData } from '@/app/actions/dashboard';
import { Event } from '@/types/eventsType';
import { MetricData, RecentActivity, DashboardRange } from '@/types/dashboardType';

interface DashboardState {
  // Data
  ticketSale: MetricData | null;
  revenue: MetricData | null;
  activeEvents: MetricData | null;
  avgTicketPrice: MetricData | null;
  upcomingEvents: Event[];
  recentActivities: RecentActivity[];

  // Filters
  range: DashboardRange;

  // UI State
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDashboardData: () => Promise<void>;
  setRange: (range: DashboardRange) => void;
  clearError: () => void;
}

export const dashboardStore = create<DashboardState>((set, get) => ({
  // Initial state
  ticketSale: null,
  revenue: null,
  activeEvents: null,
  avgTicketPrice: null,
  upcomingEvents: [],
  recentActivities: [],
  range: "all",
  isLoading: false,
  error: null,

  // Fetch dashboard data for the currently selected range
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });

    try {
      const result = await getDashboardData(get().range);

      if ('error' in result) {
        set({
          error: result.error,
          isLoading: false
        });
        return;
      }

      set({
        ticketSale: result.ticketSale,
        revenue: result.revnue,
        activeEvents: result.activeEvents,
        avgTicketPrice: result.avgTicketPrice,
        upcomingEvents: result.upcomingEvents.events,
        recentActivities: result.recentActivities.activities,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error?.message || 'Failed to load dashboard data',
        isLoading: false
      });
    }
  },

  // Switch the active range and immediately refetch with it
  setRange: (range) => {
    set({ range });
    get().fetchDashboardData();
  },

  clearError: () => set({ error: null }),
}));