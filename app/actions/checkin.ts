"use server";

import { protectedFetch } from "@/lib/protectedFetch";
import {
  CheckInScanResponse,
  AttendeeSearchResponse,
  LiveDoorMetricsResponse,
  AttendanceExportResponse,
} from "@/types/checkinType";

export async function scanCheckIn(code: string): Promise<CheckInScanResponse | { error: string }> {
  const res = await protectedFetch<CheckInScanResponse>(`/checkin/scan`, {
    method: "POST",
    body: { code },
  });
  if (!res.success) return { error: res.error };
  return res.data;
}

export async function manualCheckIn(
  txnId: string,
  ticketId: string
): Promise<CheckInScanResponse | { error: string }> {
  const res = await protectedFetch<CheckInScanResponse>(`/checkin/manual`, {
    method: "POST",
    body: { txnId, ticketId },
  });
  if (!res.success) return { error: res.error };
  return res.data;
}

export async function searchAttendees(
  eventId: string,
  query: string
): Promise<AttendeeSearchResponse | { error: string }> {
  const res = await protectedFetch<AttendeeSearchResponse>(
    `/checkin/events/${eventId}/search?query=${encodeURIComponent(query)}`,
    { method: "GET" }
  );
  if (!res.success) return { error: res.error };
  return res.data;
}

export async function getLiveDoorMetrics(
  eventId: string
): Promise<LiveDoorMetricsResponse | { error: string }> {
  const res = await protectedFetch<LiveDoorMetricsResponse>(`/checkin/events/${eventId}/live`, {
    method: "GET",
  });
  if (!res.success) return { error: res.error };
  return res.data;
}

export async function getAttendanceExport(
  eventId: string
): Promise<AttendanceExportResponse | { error: string }> {
  const res = await protectedFetch<AttendanceExportResponse>(`/checkin/events/${eventId}/export`, {
    method: "GET",
  });
  if (!res.success) return { error: res.error };
  return res.data;
}