import { create } from "zustand";
import { getEventById } from "@/app/actions/event";

/* =======================
   Domain Model (Store)
======================= */

export interface Event {
  stage: number;
  published: boolean;
  _id: string;

  eventDetails: {
    eventType: string;
    eventTitle: string;
    eventTheme: string;
    supportingText: string;
    eventBanner: string;
    startDate: Date;
    endDate: Date;
    venue: string;
    address?: string;
    brandColor: {
      primaryColor: string;
      secondaryColor: string;
    };
    eventVisibility: boolean;
  };

  aboutEvent: {
    heading: string;
    description: string;
    content: {
      subTitle: string;
      sectionContent: string;
      supportingImage: string;
    }[];
  };

  tickets: {
    ticketName: string;
    price: number;
    currency: string;
    initialQuantity: number;
    availableQuantity: number;
    benefits: string[];
    _id: string;
  }[];

  artistLineUp: {
    artistImage: string;
    artistName: string;
    artistGenre: string;
    headliner: boolean;
    socials: {
      instgram: string;
      twitter: string;
      website: string;
    };
  }[];

  emergencyContact: {
    security: string;
    medical: string;
    lostButFound: string;
    supportingInfo?: string;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

/* =======================
   API → Domain Mapper
======================= */

const mapSingleEventToEvent = (data: any): Event => ({
  _id: data._id,
  stage: data.stage ?? 1,
  published: data.published ?? false,

  eventDetails: {
    eventType: data.eventDetails.eventType,
    eventTitle: data.eventDetails.eventTitle,
    eventTheme: data.eventDetails.eventTheme,
    supportingText: data.eventDetails.supportingText,
    eventBanner: data.eventDetails.eventBanner,
    startDate: new Date(data.eventDetails.startDate),
    endDate: new Date(data.eventDetails.endDate),
    venue: data.eventDetails.venue,
    address: data.eventDetails.address,
    brandColor: {
      primaryColor: data.eventDetails.brandColor.primaryColor,
      secondaryColor: data.eventDetails.brandColor.secondaryColor,
    },
    eventVisibility: data.eventDetails.eventVisibility,
  },

  aboutEvent: data.aboutEvent,
  tickets: data.tickets,
  artistLineUp: data.artistLineUp,
  emergencyContact: data.emergencyContact,

  createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
  updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
});

/* =======================
   Store Definition
======================= */

interface EventStore {
  event: Event | null;
  isLoading: boolean;
  error: string | null;

  fetchEvent: (id: string) => Promise<void>;
  setEvent: (event: Event | null) => void;
  updateEvent: (updates: Partial<Event>) => void;
  clearEvent: () => void;
  clearError: () => void;
}

/* =======================
   Zustand Store
======================= */

export const useSingleEventStore = create<EventStore>((set, get) => ({
  event: null,
  isLoading: false,
  error: null,

  // fetchEvent: async (id: string) => {
  //   set({ isLoading: true, error: null });

  //   try {
  //     const response = await getEventById(id);

  //     // 🔑 Narrow the union FIRST
  //     if ("error" in response) {
  //       set({
  //         error: response.error || "Failed to fetch event",
  //         isLoading: false,
  //       });
  //       return;
  //     }

  //     set({
  //       event: mapSingleEventToEvent(response),
  //       isLoading: false,
  //       error: null,
  //     });
  //   } catch (err: any) {
  //     set({
  //       error: err.message || "An error occurred while fetching event",
  //       isLoading: false,
  //     });
  //   }
  // },
  fetchEvent: async (id: string) => {
  set({ isLoading: true, error: null });

  try {
    const response = await getEventById(id);

    // 🔑 Narrow the union FIRST
    if ("error" in response) {
      set({
        error: response.error || "Failed to fetch event",
        isLoading: false,
      });
      return;
    }

    // ✅ Access the nested "data" property
    set({
      event: mapSingleEventToEvent(response.data),  // ← Changed from response to response.data
      isLoading: false,
      error: null,
    });
  } catch (err: any) {
    set({
      error: err.message || "An error occurred while fetching event",
      isLoading: false,
    });
  }
},

  setEvent: (event) => {
    set({ event, error: null });
  },

  updateEvent: (updates) => {
    const currentEvent = get().event;
    if (!currentEvent) return;

    set({
      event: { ...currentEvent, ...updates },
    });
  },

  clearEvent: () => {
    set({ event: null, error: null, isLoading: false });
  },

  clearError: () => {
    set({ error: null });
  },
}));
