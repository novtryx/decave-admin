// 1. About Event Store
import { create } from "zustand";

export interface ImageData {
  url?: string;
}

export interface ExperienceSection {
  id: number;
  subTitle: string;
  content: string;
  image: ImageData | null;
}

interface AboutEventState {
  heading: string;
  description: string;
  sections: ExperienceSection[];

  setHeading: (value: string) => void;
  setDescription: (value: string) => void;
  addSection: () => void;
  deleteSection: (id: number) => void;
  updateSection: <K extends keyof ExperienceSection>(
    id: number,
    field: K,
    value: ExperienceSection[K]
  ) => void;
  
  initializeAboutEvent: (initialData?: Partial<AboutEventState>) => void;
  resetAboutEvent: () => void;
}

const defaultAboutState = {
  heading: "",
  description: "",
  sections: [
    {
      id: Date.now(),
      subTitle: "",
      content: "",
      image: null,
    },
  ],
};

export const useAboutEventStore = create<AboutEventState>((set) => ({
  ...defaultAboutState,

  setHeading: (value) => set({ heading: value }),
  setDescription: (value) => set({ description: value }),

  addSection: () =>
    set((state) => ({
      sections: [
        ...state.sections,
        {
          id: Date.now(),
          subTitle: "",
          content: "",
          image: null,
        },
      ],
    })),

  deleteSection: (id) =>
    set((state) => ({
      sections:
        state.sections.length > 1
          ? state.sections.filter((section) => section.id !== id)
          : state.sections,
    })),

  updateSection: (id, field, value) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      ),
    })),

  initializeAboutEvent: (initialData) =>
    set({
      ...defaultAboutState,
      ...initialData,
    }),

  resetAboutEvent: () => set(defaultAboutState),
}));