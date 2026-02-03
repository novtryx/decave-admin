import GrayCard from "@/components/GrayCard";
import { FiAlertTriangle } from "react-icons/fi";
import { Event } from "@/types/eventsType";

interface AlertsProps {
  events: Event[];
}

interface Alert {
  id: string;
  alert: string;
  eventName: string;
  time: string;
  alertType: "Sold out" | "Payment Error" | "Reminder";
}

export default function Alerts({ events }: AlertsProps) {
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];

    events.forEach((event) => {
      // Check for sold out tickets
      const soldOutTickets = event.tickets.filter(
        (ticket) => ticket.availableQuantity === 0
      );
      soldOutTickets.forEach((ticket) => {
        alerts.push({
          id: `${event._id}-${ticket._id}-soldout`,
          alert: `${ticket.ticketName} tier sold out`,
          eventName: event.eventDetails.eventTitle,
          time: "Recently",
          alertType: "Sold out",
        });
      });

      // Check for low ticket availability
      event.tickets.forEach((ticket) => {
        const remainingPercent =
          (ticket.availableQuantity / ticket.initialQuantity) * 100;
        if (remainingPercent > 0 && remainingPercent <= 20) {
          alerts.push({
            id: `${event._id}-${ticket._id}-low`,
            alert: `Only ${ticket.availableQuantity} ${ticket.ticketName} tickets remaining`,
            eventName: event.eventDetails.eventTitle,
            time: "Recently",
            alertType: "Reminder",
          });
        }
      });
    });

    // Return only first 3 alerts
    return alerts.slice(0, 3);
  };

  const alertData = generateAlerts();

  if (alertData.length === 0) {
    return (
      <div className="bg-[#151515] h-full p-4 border border-[#27272A] rounded-2xl">
        <div className="mb-6 flex items-center gap-2">
          <FiAlertTriangle className="text-xl text-[#cca33a]" />
          <p className="text-[#F4F4F5] text-lg">Alerts</p>
        </div>
        <p className="text-[#9F9FA9] text-center py-8">No alerts</p>
      </div>
    );
  }

  return (
    <div className="bg-[#151515] h-full p-4 border border-[#27272A] rounded-2xl">
      <div className="mb-6 flex items-center gap-2">
        <FiAlertTriangle className="text-xl text-[#cca33a]" />
        <p className="text-[#F4F4F5] text-lg">Alerts</p>
      </div>

      {/* Main Content */}
      {alertData.map((item) => (
        <GrayCard
          key={item.id}
          borderLeftColor={
            item.alertType === "Sold out"
              ? "#22C55E"
              : item.alertType === "Reminder"
              ? "#3B82F6"
              : "#EF4444"
          }
        >
          <div className="flex flex-col gap-2">
            <h4 className="text-md">{item.alert}</h4>
            <p className="text-[#B3B3B3] text-sm">{item.eventName}</p>
            <p className="text-xs text-[#71717B]">{item.time}</p>
          </div>
        </GrayCard>
      ))}
    </div>
  );
}