import { create } from "zustand";

/** Image type (can later be changed to uploaded URL) */
export interface ImageData {
  url?: string;
}

/** Experience / Section */
export interface ExperienceSection {
  id: number;
  subTitle: string;
  content: string;
  image: ImageData | null;
}

interface AboutEventState {
  /** Main content */
  heading: string;
  description: string;

  /** Dynamic sections */
  sections: ExperienceSection[];

  /** Actions */
  setHeading: (value: string) => void;
  setDescription: (value: string) => void;

  addSection: () => void;
  deleteSection: (id: number) => void;

  updateSection: <K extends keyof ExperienceSection>(
    id: number,
    field: K,
    value: ExperienceSection[K]
  ) => void;

  resetAboutEvent: () => void;
}

export const useAboutEventStore = create<AboutEventState>((set) => ({
  /* ---------------- Initial State ---------------- */
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

  /* ---------------- Setters ---------------- */
  setHeading: (value) => set({ heading: value }),

  setDescription: (value) => set({ description: value }),

  /* ---------------- Section Actions ---------------- */
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
        section.id === id
          ? { ...section, [field]: value }
          : section
      ),
    })),

  /* ---------------- Reset ---------------- */
  resetAboutEvent: () =>
    set({
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
    }),
}));
