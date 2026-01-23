// 3. Lineup Store
import { create } from "zustand";

export interface Artist {
  id: number;
  imageUrl: string | null;
  name: string;
  role: string;
  isHeadliner: boolean;
  instagram: string;
  twitter: string;
  website: string;
}

interface LineupStore {
  artists: Artist[];
  
  addArtist: () => void;
  clearAll: () => void;
  updateArtist: <K extends keyof Artist>(
    id: number,
    field: K,
    value: Artist[K]
  ) => void;
  toggleHeadliner: (id: number) => void;
  
  initializeLineup: (initialArtists?: Artist[]) => void;
  resetLineup: () => void;
}

const initialArtist = (): Artist => ({
  id: Date.now(),
  imageUrl: null,
  name: "",
  role: "",
  isHeadliner: true,
  instagram: "",
  twitter: "",
  website: "",
});

const defaultLineupState = {
  artists: [initialArtist()],
};

export const useLineupStore = create<LineupStore>((set) => ({
  ...defaultLineupState,
  
  addArtist: () =>
    set((state) => ({
      artists: [
        ...state.artists,
        {
          id: Date.now(),
          imageUrl: null,
          name: "",
          role: "",
          isHeadliner: false,
          instagram: "",
          twitter: "",
          website: "",
        },
      ],
    })),
    
  clearAll: () =>
    set({
      artists: [initialArtist()],
    }),
    
  updateArtist: (id, field, value) =>
    set((state) => ({
      artists: state.artists.map((artist) =>
        artist.id === id ? { ...artist, [field]: value } : artist
      ),
    })),
    
  toggleHeadliner: (id) =>
    set((state) => ({
      artists: state.artists.map((artist) =>
        artist.id === id
          ? { ...artist, isHeadliner: !artist.isHeadliner }
          : artist
      ),
    })),

  initializeLineup: (initialArtists) =>
    set({
      artists:
        initialArtists && initialArtists.length > 0
          ? initialArtists
          : [initialArtist()],
    }),
    
  resetLineup: () =>
    set({
      artists: [initialArtist()],
    }),
}));