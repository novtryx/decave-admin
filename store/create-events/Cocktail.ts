// Cocktail add-on store — mirrors store/create-events/Ticket.ts, but
// simpler: no benefits, sale window, or tier category. Price is
// immutable once created (same rule as tickets), enforced backend-side.
import { create } from "zustand";

export interface Cocktail {
  id: number; // frontend temp id
  _id?: string; // optional MongoDB id, present once saved
  name: string;
  description: string;
  price: string;
  quantity: string;
  isExpanded: boolean;
}

interface CocktailStore {
  cocktails: Cocktail[];

  addCocktail: () => void;
  deleteCocktail: (id: number) => void;
  updateCocktail: <K extends keyof Cocktail>(
    id: number,
    field: K,
    value: Cocktail[K]
  ) => void;
  toggleExpand: (id: number) => void;

  initializeCocktails: (initialCocktails?: Cocktail[]) => void;
  resetCocktails: () => void;
  updateOrAddCocktail: (cocktail: Cocktail) => void;
}

const defaultCocktailState = {
  cocktails: [] as Cocktail[],
};

export const useCocktailStore = create<CocktailStore>((set) => ({
  ...defaultCocktailState,

  addCocktail: () =>
    set((state) => ({
      cocktails: [
        ...state.cocktails,
        {
          id: Date.now(),
          name: "",
          description: "",
          price: "",
          quantity: "",
          isExpanded: true,
        },
      ],
    })),

  deleteCocktail: (id) =>
    set((state) => ({
      cocktails: state.cocktails.filter((c) => c.id !== id),
    })),

  updateCocktail: (id, field, value) =>
    set((state) => ({
      cocktails: state.cocktails.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    })),

  toggleExpand: (id) =>
    set((state) => ({
      cocktails: state.cocktails.map((c) =>
        c.id === id ? { ...c, isExpanded: !c.isExpanded } : c
      ),
    })),

  initializeCocktails: (initialCocktails) =>
    set(() => ({
      cocktails: initialCocktails && initialCocktails.length > 0 ? initialCocktails : [],
    })),

  resetCocktails: () => set(() => ({ ...defaultCocktailState })),

  updateOrAddCocktail: (cocktail) =>
    set((state) => {
      const exists = state.cocktails.some((c) => c.id === cocktail.id);
      return {
        cocktails: exists
          ? state.cocktails.map((c) => (c.id === cocktail.id ? cocktail : c))
          : [...state.cocktails, cocktail],
      };
    }),
}));