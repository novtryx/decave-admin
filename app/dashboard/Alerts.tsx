import GrayCard from "@/components/GrayCard"
import { FiAlertTriangle } from "react-icons/fi"

export default function Alerts() {
    const alertData = [
        {
            id: 1,
            alert: "VIP tier sold out",
            eventName: "Underground Sessions Vol. 3",
            time: "10 minutes ago",
            alertType: "Sold out"
        },
        {
            id: 2,
            alert: "3 failed payment attempts",
            eventName: "Bass Revolution",
            time: "25 minutes ago",
            alertType: "Payment Error"
        },
        {
            id: 3,
            alert: "Only 15 tickets remaining",
            eventName: "Summer Vibes Festival",
            time: "1 hour ago",
            alertType: "Reminder"
        }
    ]
    return (
        <div className="bg-[#151515] h-full p-4 border border-[#27272A] rounded-2xl">
            
            <div className=" mb-6 flex items-center gap-2">
                <FiAlertTriangle className="text-xl text-[#cca33a]" />
                <p className="text-[#F4F4F5] text-lg">Alerts</p>           
            </div>

            {/* Main Content */}
            {alertData.map((item) => (
                <GrayCard key={item.id} borderLeftColor={item.alertType === "Sold out" ? "#22C55E" : item.alertType === "Reminder" ? "#3B82F6" : "#EF4444"}>
                    <div className="flex flex-col gap-2">
                        <h4 className="text-md">{item.alert}</h4>
                        <p className="text-[#B3B3B3] text-sm">{item.eventName}</p>
                        <p className="text-xs text-[#71717B]">{item.time}</p>
                    </div>
                </GrayCard>
            ))}
        </div>
    )
}