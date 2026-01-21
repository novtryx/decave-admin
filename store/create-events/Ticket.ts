// 2. Ticket Store
import { create } from "zustand";

export interface Benefit {
  id: number;
  text: string;
}

export interface Ticket {
  id: number;
  ticketName: string;
  price: string;
  quantity: string;
  salesDate: string;
  benefits: Benefit[];
  isExpanded: boolean;
  status: "Active" | "Inactive";
  soldCount: number;
}

interface TicketStore {
  tickets: Ticket[];

  addTicket: () => void;
  deleteTicket: (id: number) => void;
  updateTicket: <K extends keyof Ticket>(
    id: number,
    field: K,
    value: Ticket[K]
  ) => void;
  toggleExpand: (id: number) => void;
  addBenefit: (ticketId: number) => void;
  deleteBenefit: (ticketId: number, benefitId: number) => void;
  updateBenefit: (ticketId: number, benefitId: number, text: string) => void;
  
  initializeTickets: (initialTickets?: Ticket[]) => void;
  resetTickets: () => void;
}

const defaultTicketState = {
  tickets: [
    {
      id: 1,
      ticketName: "Regular",
      price: "5000",
      quantity: "100",
      salesDate: "01/02/2026 - 12/02/2026",
      benefits: [{ id: 1, text: "" }],
      isExpanded: false,
      status: "Active" as const,
      soldCount: 0,
    },
  ],
};

export const useTicketStore = create<TicketStore>((set) => ({
  ...defaultTicketState,

  addTicket: () =>
    set((state) => ({
      tickets: [
        ...state.tickets,
        {
          id: Date.now(),
          ticketName: "",
          price: "",
          quantity: "",
          salesDate: "",
          benefits: [{ id: Date.now(), text: "" }],
          isExpanded: true,
          status: "Inactive",
          soldCount: 0,
        },
      ],
    })),

  deleteTicket: (id) =>
    set((state) => ({
      tickets: state.tickets.filter((t) => t.id !== id),
    })),

  updateTicket: (id, field, value) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === id ? { ...t, [field]: value } : t
      ),
    })),

  toggleExpand: (id) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === id ? { ...t, isExpanded: !t.isExpanded } : t
      ),
    })),

  addBenefit: (ticketId) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              benefits: [...t.benefits, { id: Date.now(), text: "" }],
            }
          : t
      ),
    })),

  deleteBenefit: (ticketId, benefitId) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId && t.benefits.length > 1
          ? {
              ...t,
              benefits: t.benefits.filter((b) => b.id !== benefitId),
            }
          : t
      ),
    })),

  updateBenefit: (ticketId, benefitId, text) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              benefits: t.benefits.map((b) =>
                b.id === benefitId ? { ...b, text } : b
              ),
            }
          : t
      ),
    })),

  initializeTickets: (initialTickets) =>
    set({
      tickets:
        initialTickets && initialTickets.length > 0
          ? initialTickets
          : defaultTicketState.tickets,
    }),

  resetTickets: () => set(defaultTicketState),
}));