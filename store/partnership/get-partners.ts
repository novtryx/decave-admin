// // store/partners/PartnerListStore.ts
// import { create } from "zustand";
// import { Partner } from "@/types/partnersType";
// import { getAllPartners } from "@/app/actions/partners";


// interface PartnerExtended extends Partner {}
// interface PartnerListState {
//   partners: Partner[];
//   isLoading: boolean;
//   error: string | null;
  
//   // Fetching
//   fetchPartners: () => Promise<void>;
  
//   // CRUD operations
//   setPartners: (partners: Partner[]) => void;
//   addPartner: (partner: Partner) => void;
//   updatePartner: (id: string, updates: Partial<Partner>) => void;
//   deletePartner: (id: string) => void;
  
//   // State management
//   setLoading: (isLoading: boolean) => void;
//   setError: (error: string | null) => void;
//   clearError: () => void;
  
//   // Filter/Query functions
//   getActivePartners: () => Partner[];
//   getInactivePartners: () => Partner[];
//   getPartnersByTier: (tier: Partner["sponsorshipTier"]) => Partner[];
//   getPartnerById: (id: string) => Partner | undefined;
//   searchPartners: (query: string) => Partner[];
//   getExpiringPartners: (daysThreshold?: number) => Partner[];
  
//   // Reset
//   reset: () => void;
// }

// const initialState = {
//   partners: [],
//   isLoading: false,
//   error: null,
// };

// export const usePartnerListStore = create<PartnerListState>((set, get) => ({
//   ...initialState,
  
//   // Fetch partners from API
//   fetchPartners: async () => {
//     set({ isLoading: true, error: null });
    
//     try {
//       const response = await getAllPartners();
      
//       if (response.success && response.data) {
//         set({ partners: response.data, isLoading: false });
//       } else {
//         set({ 
//           error: response.message || "Failed to fetch partners", 
//           isLoading: false 
//         });
//       }
//     } catch (error) {
//       set({ 
//         error: error instanceof Error ? error.message : "An error occurred", 
//         isLoading: false 
//       });
//       console.error("Error fetching partners:", error);
//     }
//   },
  
//   // Set partners directly
//   setPartners: (partners) => set({ partners }),
  
//   // Add a new partner to the list
//   addPartner: (partner) =>
//     set((state) => ({
//       partners: [partner, ...state.partners], // Add to beginning
//     })),
  
//   // Update an existing partner
//   updatePartner: (id, updates) =>
//     set((state) => ({
//       partners: state.partners.map((partner) =>
//         partner._id === id ? { ...partner, ...updates } : partner
//       ),
//     })),
  
//   // Delete a partner
//   deletePartner: (id) =>
//     set((state) => ({
//       partners: state.partners.filter((partner) => partner._id !== id),
//     })),
  
//   // Loading state
//   setLoading: (isLoading) => set({ isLoading }),
  
//   // Error state
//   setError: (error) => set({ error }),
  
//   // Clear error
//   clearError: () => set({ error: null }),
  
//   // Get active partners
//   getActivePartners: () => 
//     get().partners.filter((partner) => partner.isActive),
  
//   // Get inactive partners
//   getInactivePartners: () => 
//     get().partners.filter((partner) => !partner.isActive),
  
//   // Get partners by tier
//   getPartnersByTier: (tier) =>
//     get().partners.filter((partner) => partner.sponsorshipTier === tier),
  
//   // Get partner by ID
//   getPartnerById: (id) =>
//     get().partners.find((partner) => partner._id === id),
  
//   // Search partners by name, email, or contact person
//   searchPartners: (query) => {
//     const lowerQuery = query.toLowerCase();
//     return get().partners.filter(
//       (partner) =>
//         partner.partnerName.toLowerCase().includes(lowerQuery) ||
//         partner.contactPerson.toLowerCase().includes(lowerQuery) ||
//         partner.contactEmail.toLowerCase().includes(lowerQuery)
//     );
//   },
  
//   // Get partners expiring soon
//   getExpiringPartners: (daysThreshold = 30) =>
//     get().partners.filter(
//       (partner) => 
//         partner?.isActive && 
//         partner?.daysRemaining <= daysThreshold && 
//         partner?.daysRemaining >= 0
//     ),
  
//   // Reset store to initial state
//   reset: () => set(initialState),
// }));

// store/partners/PartnerListStore.ts
import { create } from "zustand";
import { Partner } from "@/types/partnersType";
import { getAllPartners } from "@/app/actions/partners";

interface PartnerListState {
  partners: Partner[];
  isLoading: boolean;
  error: string | null;

  // Fetching
  fetchPartners: () => Promise<void>;

  // CRUD operations
  setPartners: (partners: Partner[]) => void;
  addPartner: (partner: Partner) => void;
  updatePartner: (id: string, updates: Partial<Partner>) => void;
  deletePartner: (id: string) => void;

  // State management
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Query helpers
  getActivePartners: () => Partner[];
  getInactivePartners: () => Partner[];
  getPartnersByTier: (tier: Partner["sponsorshipTier"]) => Partner[];
  getPartnerById: (id: string) => Partner | undefined;
  searchPartners: (query: string) => Partner[];
  getExpiringPartners: (daysThreshold?: number) => Partner[];

  // Reset
  reset: () => void;
}

const initialState = {
  partners: [] as Partner[],
  isLoading: false,
  error: null,
};

export const usePartnerListStore = create<PartnerListState>((set, get) => ({
  ...initialState,

  /* =======================
     Fetch partners
  ======================= */
  fetchPartners: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await getAllPartners();

      // 🔑 Narrow union first
      if ("error" in response) {
        set({ error: response.error, isLoading: false });
        return;
      }

      // ✅ response is PartnersListResponse
      set({
        partners: response.data, // safely extract the array
        isLoading: false,
        error: null,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "An error occurred",
        isLoading: false,
      });
      console.error("Error fetching partners:", err);
    }
  },

  /* =======================
     CRUD
  ======================= */
  setPartners: (partners) => set({ partners }),

  addPartner: (partner) =>
    set((state) => ({
      partners: [partner, ...state.partners],
    })),

  updatePartner: (id, updates) =>
    set((state) => ({
      partners: state.partners.map((partner) =>
        partner._id === id ? { ...partner, ...updates } : partner
      ),
    })),

  deletePartner: (id) =>
    set((state) => ({
      partners: state.partners.filter((partner) => partner._id !== id),
    })),

  /* =======================
     State helpers
  ======================= */
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  /* =======================
     Selectors / Queries
  ======================= */
  getActivePartners: () =>
    get().partners.filter((partner) => partner.isActive),

  getInactivePartners: () =>
    get().partners.filter((partner) => !partner.isActive),

  getPartnersByTier: (tier) =>
    get().partners.filter(
      (partner) => partner.sponsorshipTier === tier
    ),

  getPartnerById: (id) =>
    get().partners.find((partner) => partner._id === id),

  searchPartners: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().partners.filter(
      (partner) =>
        partner.partnerName.toLowerCase().includes(lowerQuery) ||
        partner.contactPerson.toLowerCase().includes(lowerQuery) ||
        partner.contactEmail.toLowerCase().includes(lowerQuery)
    );
  },

  getExpiringPartners: (daysThreshold = 30) =>
    get().partners.filter(
      (partner) =>
        partner.isActive &&
        partner.daysRemaining <= daysThreshold &&
        partner.daysRemaining >= 0
    ),

  /* =======================
     Reset
  ======================= */
  reset: () => set(initialState),
}));
