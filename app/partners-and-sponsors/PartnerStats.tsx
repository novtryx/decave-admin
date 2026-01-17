import FlashCard from "@/components/dashboard/FlashCard"
import { FaCheck, FaHandshakeAngle } from "react-icons/fa6"
import { LuTicket } from "react-icons/lu"
import { MdOutlineCalendarMonth } from "react-icons/md"

export default function PartnerStats() {
    const statsData = [
        {
            id: 1,
            icon: <FaHandshakeAngle />,
            title: "Total Partners",
            value: "5"
        },
        {
            id: 2,
            icon: <FaCheck />,
            title: "Active",
            value: "4"
        },
        {
            id: 3,
            icon: <LuTicket />,
            title: "Platinum Tier",
            value: "2"
        },
        {
            id: 4,
            icon: <MdOutlineCalendarMonth />,
            title: "Event Association",
            value: "11"
        },
    ]
    return (
        <div className="my-10 grid grid-cols-1 lg:grid-cols-4 gap-3">
            {statsData.map((item) => (
                <FlashCard key={item.id}>
                    <div className="flex flex-col gap-2">
                        {/* icon */}
                        <div className={`${item.title === "Active" ? "bg-[#0F2A1A] text-[#22C55E]" : "bg-[#2A2A2A] text-[#F9F7F4]"} h-12 w-12 p-2 flex items-center justify-center rounded-xl`}>
                            {item.icon}
                        </div>
                        {/* Title */}
                        <p className="text-sm text-[#9F9FA9]">{item.title}</p>
                        {/* Value */}
                        <h3 className="text-2xl font-semibold text-[#F4F4F5]">{item.value}</h3>
                    </div>    
                </FlashCard>
            ))}
        </div>
    )
}