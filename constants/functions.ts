import { Event, TotalTicketStats } from "@/types/eventsType";

//calculate totaltickets
//geteventStatus
//format date

export const calculateTotalTickets = (
  tickets: Event['tickets']
): TotalTicketStats => {
  let totalInitialTickets = 0;
  let totalSoldTickets = 0;

  for (const ticket of tickets) {
    totalInitialTickets += ticket.initialQuantity;
    totalSoldTickets += ticket.initialQuantity - ticket.availableQuantity;
  }

  return {
    totalInitialTickets,
    totalSoldTickets
  };
};

type EventStatus = "draft" | "live" | "past" | "upcoming";

export const getEventStatus = (event: Event): EventStatus => {
  const now = new Date();
  const eventStartDate = new Date(event.eventDetails.startDate);
  const eventEndDate = new Date(event.eventDetails.endDate);

  // Check if event is in draft mode
  if (event.stage < 5 || !event.published) {
    return "draft";
  }

  // Event is published and complete (stage 5)
  // Check if event has ended
  if (eventEndDate < now) {
    return "past";
  }

  // Check if event hasn't started yet
  if (eventStartDate > now) {
    return "upcoming";
  }

  // Event is currently happening
  return "live";
};


export const formatDate = (date: Date | string): string => {
  const dateObj = new Date(date);
  
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const month = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  
  return `${month} ${day}, ${year}`;
};