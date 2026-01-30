// store/partners/PartnerStore.ts
import { create } from "zustand";

export interface PartnerState {
  // Partnership Information
  partnerName: string;
  logoUrl: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;

  // Sponsorship Details
  sponsorshipTier: "" | "platinum" | "gold" | "silver" | "bronze";
  selectedEvents: string[];
  startDate: string;
  endDate: string;
  internalNotes: string;

  // Visibility Controls
  showOnWebsite: boolean;
  featureOnPage: boolean;

  // Actions
  setField: <K extends keyof PartnerState>(
    key: K,
    value: PartnerState[K]
  ) => void;
  toggleEvent: (eventId: string) => void;
  toggleShowOnWebsite: () => void;
  toggleFeatureOnPage: () => void;

  // Initialize and Reset
  initializePartner: (initialData?: Partial<PartnerState>) => void;
  resetPartner: () => void;
}

const defaultPartnerState = {
  partnerName: "",
  logoUrl: "",
  contactPerson: "",
  contactEmail: "",
  contactPhone: "",
  sponsorshipTier: "" as const,
  selectedEvents: [],
  startDate: "",
  endDate: "",
  internalNotes: "",
  showOnWebsite: true,
  featureOnPage: true,
};

export const usePartnerStore = create<PartnerState>((set) => ({
  ...defaultPartnerState,

  setField: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),

  toggleEvent: (eventId) =>
    set((state) => ({
      selectedEvents: state.selectedEvents.includes(eventId)
        ? state.selectedEvents.filter((e) => e !== eventId)
        : [...state.selectedEvents, eventId],
    })),

  toggleShowOnWebsite: () =>
    set((state) => ({
      showOnWebsite: !state.showOnWebsite,
    })),

  toggleFeatureOnPage: () =>
    set((state) => ({
      featureOnPage: !state.featureOnPage,
    })),

  initializePartner: (initialData) =>
    set({
      ...defaultPartnerState,
      ...initialData,
    }),

  resetPartner: () => set(defaultPartnerState),
}));