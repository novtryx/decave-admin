export interface CheckInBuyerResult {
  fullName: string;
  email: string;
  ticketId: string;
  checkedInAt: string;
}

export interface CheckInScanResponse {
  success: boolean;
  message: string;
  duplicate: boolean;
  buyer: CheckInBuyerResult;
  eventTitle: string;
}

export interface AttendeeSearchResult {
  txnId: string;
  ticketId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  checkedIn: boolean;
  checkedInAt: string | null;
}

export interface AttendeeSearchResponse {
  success: boolean;
  data: AttendeeSearchResult[];
}

export interface LiveDoorMetrics {
  eventId: string;
  eventTitle: string;
  expectedGuests: number;
  checkedInGuests: number;
  notYetArrived: number;
  checkInRate: number;
  peakEntryHour: number | null;
  gateSalesCount: number;
  doorRevenue: number;
}

export interface LiveDoorMetricsResponse {
  success: boolean;
  data: LiveDoorMetrics;
}

export interface AttendanceRow {
  txnId: string;
  ticketId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  ticketName: string;
  tierCategory: string;
  checkedIn: boolean;
  checkedInAt: string | null;
}

export interface AttendanceExportResponse {
  success: boolean;
  data: { eventTitle: string; rows: AttendanceRow[] };
}

// ==================== COCKTAIL REDEMPTION ====================

export interface CocktailOrderItem {
  cocktailId: string;
  name: string;
  quantity: number;
  redeemedQuantity: number;
  remaining: number;
}

export interface CocktailOrderLookup {
  txnId: string;
  eventTitle: string;
  buyerName: string;
  items: CocktailOrderItem[];
}

export interface CocktailOrderLookupResponse {
  success: boolean;
  data: CocktailOrderLookup;
}

export interface CocktailRedeemResult {
  txnId: string;
  items: CocktailOrderItem[];
}

export interface CocktailRedeemResponse {
  success: boolean;
  message: string;
  data: CocktailRedeemResult;
}