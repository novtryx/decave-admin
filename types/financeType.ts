export type FinanceEntryType = "credit" | "debit";

export const EXPENSE_CATEGORIES = [
  "venue",
  "sound",
  "lights",
  "media",
  "security",
  "logistics",
  "djs_talent",
  "influencer_payout",
  "printing",
  "marketing",
  "operations",
  "other",
] as const;

export const INCOME_CATEGORIES = [
  "ticket_sales",
  "sponsorship",
  "vendor_fee",
  "merchandise",
  "other",
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  venue: "Venue",
  sound: "Sound",
  lights: "Lights",
  media: "Media",
  security: "Security",
  logistics: "Logistics",
  djs_talent: "DJs / Talent",
  influencer_payout: "Influencer Payout",
  printing: "Printing",
  marketing: "Marketing",
  operations: "Operations",
  ticket_sales: "Ticket Sales",
  sponsorship: "Sponsorship",
  vendor_fee: "Vendor Fee",
  merchandise: "Merchandise",
  other: "Other",
};

export const getCategoryLabel = (category: string) =>
  CATEGORY_LABELS[category] || category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export interface FinanceEntry {
  _id: string;
  event: { _id: string; eventDetails: { eventTitle: string } } | null;
  type: FinanceEntryType;
  category: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  createdBy: { _id: string; fullName?: string; email?: string } | null;
  createdAt: string;
}

export interface FinanceEntryPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FinanceEntriesResponse {
  success: boolean;
  data: FinanceEntry[];
  pagination: FinanceEntryPagination;
}

export interface FinanceEntryFilters {
  eventId?: string;
  type?: FinanceEntryType;
  category?: string;
  from?: string;
  to?: string;
}

export interface FinanceEntryInput {
  eventId?: string | null;
  type: FinanceEntryType;
  category: string;
  amount: number;
  currency?: string;
  description?: string;
  date?: string;
}

export interface EventFinanceSummary {
  eventId: string;
  eventTitle: string;
  ticketRevenue: number;
  refundedAmount: number;
  netTicketRevenue: number;
  manualCredits: number;
  manualDebits: number;
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  expenseByCategory: { category: string; total: number }[];
}

export interface EventFinanceSummaryResponse {
  success: boolean;
  data: EventFinanceSummary;
}

export interface FinanceOverview {
  allTime: { totalRevenue: number; totalExpenses: number; profit: number };
  unassigned: { credits: number; debits: number };
  events: EventFinanceSummary[];
}

export interface FinanceOverviewResponse {
  success: boolean;
  data: FinanceOverview;
}