import { create } from 'zustand';
import { getDashboardData } from '@/app/actions/dashboard';
import { Event } from '@/types/eventsType';
import { MetricData, RecentActivity } from '@/types/dashboardType';

interface DashboardState {
  // Data
  ticketSale: MetricData | null;
  revenue: MetricData | null;
  activeEvents: MetricData | null;
  avgTicketPrice: MetricData | null;
  upcomingEvents: Event[];
  recentActivities: RecentActivity[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchDashboardData: () => Promise<void>;
  clearError: () => void;
}

export const dashboardStore = create<DashboardState>((set) => ({
  // Initial state
  ticketSale: null,
  revenue: null,
  activeEvents: null,
  avgTicketPrice: null,
  upcomingEvents: [],
  recentActivities: [],
  isLoading: false,
  error: null,

  // Fetch dashboard data
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await getDashboardData();
      
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

  clearError: () => set({ error: null }),
}));