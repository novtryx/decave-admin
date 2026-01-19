"use server";
import { protectedFetch } from "@/lib/protectedFetch";
import { Event } from "@/types/eventsType";

export async function getAllEvents(
  
) {
  const res = await protectedFetch<{ message: string, success: boolean, data: Event[] }>("/events", {
    method: "GET",
    
  });
  return res;
}