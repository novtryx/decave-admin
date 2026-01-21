"use server";
import { protectedFetch } from "@/lib/protectedFetch";
import { Event } from "@/types/eventsType";

interface eventDataType{
    message: string;
    success: boolean;
    data: Event[]
}
interface singleEventDataType{
    message: string;
    success: boolean;
    data: Event
}
export async function getAllEvents(
  
) {
  const res = await protectedFetch<eventDataType>("/events", {
    method: "GET",
   
  });
  return res;
}

export async function getEventById(
  id: string
) {
  const res = await protectedFetch<singleEventDataType>(`/events/${id}`, {
    method: "GET",
   
  });
  return res;
}

export async function CreateEventAction(data: any){
    const res = await protectedFetch<{
       message: string;
    success: boolean;
    data: Event
    }>("/events", {
        method: "POST",
         body: {eventDetails:data},
    })

    return res
}

export async function EditEventAction(data: any, id:string){
    const res = await protectedFetch<{
       message: string;
    success: boolean;
    data: Event
    }>(`/events/${id}`, {
        method: "PUT",
         body: data,
    })

    return res
}