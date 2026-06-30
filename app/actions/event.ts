// ==================== EVENTS ACTIONS ====================
"use server";
import { protectedFetch } from "@/lib/protectedFetch";
import { publicFetch2 } from "@/lib/publicFetch";
import { Event, EventsPagination } from "@/types/eventsType";

interface EventDataType {
  message: string;
  success: boolean;
  data: Event[];
  pagination: EventsPagination;
}

// Fields accepted when creating a brand-new ticket. Note:
// `availableQuantity` is intentionally absent — the backend always
// sets it equal to `initialQuantity` for a new ticket.
export interface CreateTicketData {
  eventId: string;
  ticketName: string;
  price: number;
  currency?: string;
  initialQuantity: number;
  benefits?: string[];
  saleStartDate?: string | null;
  saleEndDate?: string | null;
}

// Fields accepted when updating an EXISTING ticket. `price` is
// deliberately not part of this type — the backend rejects it
// outright (400) since a ticket's price is immutable once created.
export interface UpdateTicketData {
  ticketName?: string;
  currency?: string;
  initialQuantity?: number;
  availableQuantity?: number;
  benefits?: string[];
  saleStartDate?: string | null;
  saleEndDate?: string | null;
}

export interface TicketType {
  eventId: string;
  ticketId: string;
  data: UpdateTicketData;
}

interface SingleEventDataType {
  message: string;
  success: boolean;
  data: Event;
}

export async function getAllEvents(
  page: number = 1,
  limit: number = 10,
  filters?: { published?: boolean; stage?: number }
): Promise<EventDataType | { error: string }> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (filters?.published !== undefined) {
    params.set("published", String(filters.published));
  }
  if (filters?.stage !== undefined) {
    params.set("stage", String(filters.stage));
  }

  const res = await protectedFetch<EventDataType>(`/events?${params.toString()}`, {
    method: "GET",
  });

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}

export async function getEventById(
  id: string
): Promise<SingleEventDataType | { error: string }> {
  const res = await protectedFetch<SingleEventDataType>(`/events/${id}`, {
    method: "GET",
  });

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}

export async function CreateEventAction(
  data: any
): Promise<{ message: string; success: boolean; data: Event } | { error: string }> {
  const res = await protectedFetch<{
    message: string;
    success: boolean;
    data: Event;
  }>("/events", {
    method: "POST",
    body: { eventDetails: data },
  });

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}

export async function EditEventAction(
  data: any,
  id: string
): Promise<{ message: string; success: boolean; data: Event } | { error: string }> {
  const res = await protectedFetch<{
    message: string;
    success: boolean;
    data: Event;
  }>(`/events/${id}`, {
    method: "PUT",
    body: data,
  });

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}

export async function DeleteEventAction(
  id: string
): Promise<{ message: string; success: boolean } | { error: string }> {
  const res = await protectedFetch<{ message: string; success: boolean }>(
    `/events/${id}`,
    { method: "DELETE" }
  );

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}

// Updates a single, already-existing ticket. Never send `price` here —
// the backend rejects it (a ticket's price can't change post-creation).
export async function UpdateEventTicketAction(
  eventId: string,
  ticketId: string,
  data: UpdateTicketData
): Promise<
  { message: string; success: boolean; data: Event; warnings?: string[] } | { error: string }
> {
  const res = await protectedFetch<{
    message: string;
    success: boolean;
    data: Event;
    warnings?: string[];
  }>(`/events/${eventId}/tickets/${ticketId}`, {
    method: "PATCH",
    body: data,
  });

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}

export async function CreateEventTicketAction(
  data: CreateTicketData
): Promise<
  { message: string; success: boolean; data: Event } | { error: string }
> {
  const res = await protectedFetch<{
    message: string;
    success: boolean;
    data: Event;
  }>(`/events/create-ticket/${data.eventId}`, {
    method: "POST",
    body: data,
  });

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}



export async function getOtherEvents(page= 1): Promise<any | { error: string }> {
  const res = await publicFetch2<EventDataType>(`/events/admin/all-stats?page=${page}&limit=20`, {
    method: "GET",
  });

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}

export async function approveEvent(id: number, approved: boolean): Promise<any | { error: string }> {
  const res = await publicFetch2<EventDataType>(`/events/${id}/toggle-approval`, {
    method: "PATCH",
  });

  if (!res.success) {
    return { error: res.error };
  }

  return res.data;
}