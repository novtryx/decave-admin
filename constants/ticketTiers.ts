// Mirrors public/src/constants/ticketTiers.ts on the backend. Kept as
// a plain lookup (not shared across repos) since these two projects
// deploy independently.

export const TICKET_TIER_CATEGORIES = [
  "early_access",
  "first_release",
  "standard",
  "final",
  "gate",
  "vip",
  "table",
  "complimentary",
  "sponsor_guest",
  "influencer_guest",
] as const;

export type TicketTierCategory = (typeof TICKET_TIER_CATEGORIES)[number];

export const TICKET_TIER_LABELS: Record<string, string> = {
  early_access: "Early Access",
  first_release: "First Release",
  standard: "Standard",
  final: "Final",
  gate: "Gate",
  vip: "VIP",
  table: "Table",
  complimentary: "Complimentary",
  sponsor_guest: "Sponsor Guest",
  influencer_guest: "Influencer Guest",
};

export const getTierLabel = (tierCategory?: string | null) =>
  TICKET_TIER_LABELS[tierCategory || "standard"] || "Standard";

export const SALE_WINDOW_LABELS: Record<string, { label: string; color: string }> = {
  on_sale: { label: "On Sale", color: "bg-[#0F2A1A] text-[#22C55E]" },
  not_yet_open: { label: "Not Yet Open", color: "bg-[#2A1F0F] text-[#F59E0B]" },
  closed: { label: "Closed", color: "bg-[#2A0F0F] text-[#EF4444]" },
  no_window_set: { label: "Always Open", color: "bg-[#1a1a1a] text-[#9F9FA9]" },
};