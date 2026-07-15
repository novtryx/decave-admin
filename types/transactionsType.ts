// types/transactionsType.ts
//
// Mirrors the backend's event-grouped transaction history flow:
//   GET /transaction/events            -> EventTransactionSummary[]  (landing view)
//   GET /transaction/events/:eventId   -> EventTransactionDetail     (drill-down view)

export interface EventTransactionSummary {
  _id: string;
  eventTitle: string;
  eventBanner: string;
  venue: string;
  startDate: string;
  endDate: string;
  eventVisibility: boolean;
  published: boolean;
  totalRevenue: number;
  totalTicketsSold: number;
  totalTransactions: number;
  totalPending: number;
  totalFailed: number;
  totalCompleted: number;
  lastTransactionAt: string | null;
}

export interface TransactionBuyer {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  ticketId: string;
  checkedIn: boolean;
}

// A single transaction row, scoped to one event (no nested `event`
// object — the event is already known from the page context).
export type TransactionStatus =
  | "completed"
  | "pending"
  | "failed"
  | "refunded"
  | "cancelled"
  | "manually_verified";

export interface Transaction {
  _id: string;
  txnId: string;
  paystackId: string;
  status: TransactionStatus;
  createdAt: string;
  quantity: number;
  revenue: number;
  checkedInCount: number;
  buyerEmail: string;
  buyers: TransactionBuyer[];
  ticket: {
    _id: string;
    ticketName: string;
    price: number;
    currency: string;
    saleStartDate?: string | null;
    saleEndDate?: string | null;
  };
}

// ── Pending payment aging (GET /transaction/pending-aging) ──
export interface PendingAgingItem {
  txnId: string;
  eventId: string;
  eventTitle: string;
  buyerEmail: string;
  buyerName: string;
  quantity: number;
  createdAt: string;
  ageMinutes: number;
}

export interface PendingAgingBucket {
  count: number;
  transactions: PendingAgingItem[];
}

export interface PendingAgingResponse {
  success: boolean;
  totalPending: number;
  buckets: {
    under5Min: PendingAgingBucket;
    fiveMinTo1Hour: PendingAgingBucket;
    oneHourTo6Hours: PendingAgingBucket;
    sixHoursTo24Hours: PendingAgingBucket;
    expired: PendingAgingBucket;
  };
}

// ── Abandoned checkout recovery (GET /transaction/abandoned) ──
export interface AbandonedCheckout {
  txnId: string;
  eventId: string;
  eventTitle: string;
  buyers: { fullName: string; email: string; phoneNumber: string }[];
  quantity: number;
  createdAt: string;
  ageMinutes: number;
}

export interface AbandonedCheckoutsResponse {
  success: boolean;
  data: AbandonedCheckout[];
  pagination: TransactionPagination;
}

export interface EventTransactionTotals {
  totalRevenue: number;
  totalPending: number;
  totalFailed: number;
  totalCompleted: number;
  totalCheckedIn: number;
}

export interface EventTransactionDetailEvent {
  _id: string;
  eventTitle: string;
  eventBanner: string;
  venue: string;
  startDate: string;
  endDate: string;
  published: boolean;
}

export interface TransactionPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}