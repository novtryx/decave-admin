// 4. Contact Store
import { create } from "zustand";

interface ContactState {
  security: string;
  medical: string;
  lostFound: string;
  supportingInfo: string;
  faq: Array<{ question: string; answer: string }>;
  code: Array<{ title: string; body: string }>;

  setField: <K extends keyof ContactState>(
    key: K,
    value: ContactState[K]
  ) => void;

  initializeContact: (initialData?: Partial<ContactState>) => void;
  resetContact: () => void;
}

const defaultContactState = {
  security: "",
  medical: "",
  lostFound: "",
  supportingInfo: "",
  faq: [
    {
    question: "",
    answer: ""
    }
  ],
  code: [
    {
    title: "",
    body: ""
    }
  ],
};

export const useContactStore = create<ContactState>((set) => ({
  ...defaultContactState,

  setField: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),

  initializeContact: (initialData) =>
    set({
      ...defaultContactState,
      ...initialData,
    }),

  resetContact: () => set(defaultContactState),
}));