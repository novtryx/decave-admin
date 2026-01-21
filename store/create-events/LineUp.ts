import { create } from "zustand";

/* ================= TYPES ================= */
export interface Artist {
  id: number;
  imageUrl: string | null; // Changed from `image: File | null`
  name: string;
  role: string;
  isHeadliner: boolean;
  instagram: string;
  twitter: string;
  website: string;
}

interface LineupStore {
  artists: Artist[];
  // actions
  addArtist: () => void;
  clearAll: () => void;
  updateArtist: <K extends keyof Artist>(
    id: number,
    field: K,
    value: Artist[K]
  ) => void;
  toggleHeadliner: (id: number) => void;
  resetLineup: () => void;
}

/* ================= INITIAL ARTIST ================= */
const initialArtist = (): Artist => ({
  id: Date.now(),
  imageUrl: null, // Changed from `image: null`
  name: "",
  role: "",
  isHeadliner: true,
  instagram: "",
  twitter: "",
  website: "",
});

/* ================= STORE ================= */
export const useLineupStore = create<LineupStore>((set) => ({
  artists: [initialArtist()],
  
  addArtist: () =>
    set((state) => ({
      artists: [
        ...state.artists,
        {
          id: Date.now(),
          imageUrl: null, // Changed from `image: null`
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
    
  resetLineup: () =>
    set({
      artists: [initialArtist()],
    }),
}));