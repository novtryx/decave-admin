import { create } from 'zustand';
import { getEventById } from '@/app/actions/event';

export interface Event {
  stage: number;
  published: boolean;
  _id: string;
  // stage 1
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
  // stage 2
  aboutEvent: {
    heading: string;
    description: string;
    content: {
      subTitle: string;
      sectionContent: string;
      supportingImage: string;
    }[];
  };
  // stage 3
  tickets: {
    ticketName: string;
    price: number;
    currency: string;
    initialQuantity: number;
    availableQuantity: number;
    benefits: string[];
    _id: string;
  }[];
  // stage 4
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
  // stage 5
  emergencyContact: {
    security: string;
    medical: string;
    lostButFound: string;
    supportingInfo?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

interface EventStore {
  event: Event | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchEvent: (id: string) => Promise<void>;
  setEvent: (event: Event | null) => void;
  updateEvent: (updates: Partial<Event>) => void;
  clearEvent: () => void;
  clearError: () => void;
}

export const useSingleEventStore = create<EventStore>((set, get) => ({
  event: null,
  isLoading: false,
  error: null,

  fetchEvent: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getEventById(id);
    
      if (response.success && response.data) {
        set({ 
          event: response.data, 
          isLoading: false,
          error: null 
        });
      } else {
        set({ 
          error: response.message || 'Failed to fetch event',
          isLoading: false 
        });
      }
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred while fetching event',
        isLoading: false 
      });
    }
  },

  setEvent: (event: Event | null) => {
    set({ event, error: null });
  },

  updateEvent: (updates: Partial<Event>) => {
    const currentEvent = get().event;
    if (currentEvent) {
      set({ event: { ...currentEvent, ...updates } });
    }
  },

  clearEvent: () => {
    set({ event: null, error: null, isLoading: false });
  },

  clearError: () => {
    set({ error: null });
  },
}));