import { create } from "zustand";
import { getAllPartners } from "@/app/actions/partners";
import { Partner } from "@/types/partnersType";

interface PartnerStats {
  totalPartners: number;
  activePartners: number;
  platinumTier: number;
  totalEventAssociations: number;
}

interface PartnerStore {
  // State
  partners: Partner[];
  loading: boolean;
  error: string | null;
  
  // Computed stats
  stats: PartnerStats;
  
  // Actions
  fetchPartners: () => Promise<void>;
  clearError: () => void;
}

export const usePartnerStore = create<PartnerStore>((set, get) => ({
  // Initial state
  partners: [],
  loading: false,
  error: null,
  stats: {
    totalPartners: 0,
    activePartners: 0,
    platinumTier: 0,
    totalEventAssociations: 0,
  },

  // Fetch partners and calculate stats
  fetchPartners: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await getAllPartners();
      
      if ('error' in response) {
        set({ error: response.error, loading: false });
        return;
      }
      
      const partners = response.data;
      
      // Calculate stats
      const stats: PartnerStats = {
        totalPartners: partners.length,
        activePartners: partners.filter((p) => p.status).length,
        platinumTier: partners.filter(
          (p) => p.sponsorshipTier.toLowerCase() === "platinum"
        ).length,
        totalEventAssociations: partners.reduce((total, partner) => {
          return total + (partner.associatedEvents?.length || 0);
        }, 0),
      };
      
      set({ partners, stats, loading: false });
    } catch (err) {
      set({ 
        error: "An error occurred while fetching partners", 
        loading: false 
      });
      console.error(err);
    }
  },
  
  // Clear error
  clearError: () => set({ error: null }),
}));