import { create } from "zustand";

// 1️⃣ Define state type
interface LoadingState {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

// 2️⃣ Create store
export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,

  startLoading: () => set({ isLoading: true }),
  stopLoading: () => set({ isLoading: false }),
}));
