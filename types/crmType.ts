export interface Customer {
  email: string;
  fullName: string;
  phoneNumber: string;
  totalSpend: number;
  ticketsPurchased: number;
  eventsAttendedCount: number;
  checkedInCount: number;
  referralSource: string;
  firstPurchaseDate: string;
  lastPurchaseDate: string;
  tags: string[];
  notes: string;
}

export interface CustomerPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CustomersResponse {
  success: boolean;
  data: Customer[];
  pagination: CustomerPagination;
}

export interface CustomerHistoryItem {
  transactionId: string;
  txnId: string;
  status: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  checkedIn: boolean;
  ticketId: string;
  referralSource: string;
  createdAt: string;
}

export interface CustomerDetail {
  email: string;
  fullName: string;
  phoneNumber: string;
  tags: string[];
  notes: string;
  totalTransactions: number;
  history: CustomerHistoryItem[];
}

export interface CustomerDetailResponse {
  success: boolean;
  data: CustomerDetail;
}

export interface CustomerFilters {
  search?: string;
  eventId?: string;
  ticketTierCategory?: string;
  minSpend?: number;
  maxSpend?: number;
  attendanceStatus?: "checked_in" | "never_checked_in";
  tag?: string;
}

// Auto-derived tags the backend computes on every fetch. Manual tags
// (vendor, press, etc) are freeform beyond this list.
export const AUTO_CUSTOMER_TAGS = [
  "first_time_buyer",
  "regular_buyer",
  "vip",
  "table_buyer",
  "sponsor_guest",
  "influencer_referral",
] as const;

export const SUGGESTED_MANUAL_TAGS = ["vendor", "press", "vip", "regular_buyer"];

export const CUSTOMER_TAG_LABELS: Record<string, string> = {
  first_time_buyer: "First-Time Buyer",
  regular_buyer: "Regular Buyer",
  vip: "VIP",
  table_buyer: "Table Buyer",
  sponsor_guest: "Sponsor Guest",
  influencer_referral: "Influencer Referral",
  vendor: "Vendor",
  press: "Press",
};

export const getTagLabel = (tag: string) =>
  CUSTOMER_TAG_LABELS[tag] || tag.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());