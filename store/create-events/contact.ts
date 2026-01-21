import { create } from "zustand";

interface ContactState {
  security: string;
  medical: string;
  lostFound: string;
  supportingInfo: string;

  // actions
  setField: <K extends keyof ContactState>(
    key: K,
    value: ContactState[K]
  ) => void;

  resetContact: () => void;
}

export const useContactStore = create<ContactState>((set) => ({
  security: "",
  medical: "",
  lostFound: "",
  supportingInfo: "",

  setField: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),

  resetContact: () =>
    set({
      security: "",
      medical: "",
      lostFound: "",
      supportingInfo: "",
    }),
}));
