
// ==================== EVENTS ACTIONS ====================
"use server";
import { protectedFetch } from "@/lib/protectedFetch";
import { Event } from "@/types/eventsType";

interface EventDataType {
  message: string;
  success: boolean;
  data: Event[];
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


// "use server";
// import { protectedFetch } from "@/lib/protectedFetch";
// import { Event } from "@/types/eventsType";

// interface eventDataType{
//     message: string;
//     success: boolean;
//     data: Event[]
// }
// interface singleEventDataType{
//     message: string;
//     success: boolean;
//     data: Event
// }
// export async function getAllEvents(
  
// ) {
//   const res = await protectedFetch<eventDataType>("/events", {
//     method: "GET",
   
//   });
//   return res;
// }

// export async function getEventById(
//   id: string
// ) {
//   const res = await protectedFetch<singleEventDataType>(`/events/${id}`, {
//     method: "GET",
   
//   });
//   return res;
// }

// export async function CreateEventAction(data: any){
//     const res = await protectedFetch<{
//        message: string;
//     success: boolean;
//     data: Event
//     }>("/events", {
//         method: "POST",
//          body: {eventDetails:data},
//     })

//     return res
// }

// export async function EditEventAction(data: any, id:string){
//     const res = await protectedFetch<{
//        message: string;
//     success: boolean;
//     data: Event
//     }>(`/events/${id}`, {
//         method: "PUT",
//          body: data,
//     })

//     return res
// }

