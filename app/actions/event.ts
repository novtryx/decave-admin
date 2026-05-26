
// ==================== EVENTS ACTIONS ====================
"use server";
import { protectedFetch } from "@/lib/protectedFetch";
import { publicFetch2 } from "@/lib/publicFetch";
import { Event } from "@/types/eventsType";

interface EventDataType {
  message: string;
  success: boolean;
  data: Event[];
}

export interface TicketType{
  eventId: string,
  ticketId: string,
  data: {
    ticketName?: string;
    price?: number;
    currency?: string;
    initialQuantity?: number;
    availableQuantity?: number;
    benefits?: string[];
  }
}

interface SingleEventDataType {
  message: string;
  success: boolean;
  data: Event;
}

// ✅ Add return types with error handling
export async function getAllEvents(): Promise<EventDataType | { error: string }> {
  const res = await protectedFetch<EventDataType>("/events", {
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

export async function UpdateEventTicketAction(
  eventId: string,
  ticketId: string,
  data: {
    ticketName?: string;
    price?: number;
    currency?: string;
    initialQuantity?: number;
    availableQuantity?: number;
    benefits?: string[];
  }
): Promise<
  { message: string; success: boolean; data: Event } | { error: string }
> {
  const res = await protectedFetch<{
    message: string;
    success: boolean;
    data: Event;
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
  data: {
    eventId: string;
    ticketName: string;
    price: number;
    currency?: string;
    initialQuantity: number;
    benefits?: string[];
  }
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