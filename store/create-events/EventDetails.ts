import { create } from "zustand";

export interface ImageData {
  url: string;
}

interface EventState {
  // Event Details
  eventType: string;
  eventTitle: string;
  eventTheme: string;
  supportingText: string;

  // Date & Time
startDateTime: Date | null;
  endDateTime: Date | null;

  setDateTime: (start: Date, end: Date) => void;

  // Location
  venue: string;
  fullAddress: string;

  // Branding
  primaryColor: string;
  secondaryColor: string;

  // Visibility
  eventVisibility: boolean;

  // Media
  bannerFile: ImageData | null;

  // Actions
  setField: <K extends keyof EventState>(
    key: K,
    value: EventState[K]
  ) => void;

  resetEvent: () => void;
}

export const useEventStore = create<EventState>((set) => ({
  // Initial State
  eventType: "",
  eventTitle: "",
  eventTheme: "",
  supportingText: "",

  startDateTime: null,
endDateTime: null,

setDateTime: (start, end) =>
  set({
    startDateTime: start,
    endDateTime: end,
  }),

  venue: "",
  fullAddress: "",

  primaryColor: "#CCA33A",
  secondaryColor: "#001D3D",

  eventVisibility: false,

  bannerFile: null,

  // Generic setter
  setField: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),

  // Reset (optional)
  resetEvent: () =>
    set({
      eventType: "",
      eventTitle: "",
      eventTheme: "",
      supportingText: "",
      startDateTime: null,
      endDateTime: null,
    
      venue: "",
      fullAddress: "",
      primaryColor: "#CCA33A",
      secondaryColor: "#001D3D",
      eventVisibility: false,
      bannerFile: null,
    }),
}));
