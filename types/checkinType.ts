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