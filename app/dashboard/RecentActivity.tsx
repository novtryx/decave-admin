import GrayCard from "@/components/GrayCard"
import { FaRegCircleCheck } from "react-icons/fa6"
import { MdOutlineCalendarMonth } from "react-icons/md"

export default function RecentActivity() {
    const activityData = [
        {
            id: 1,
            icon: <FaRegCircleCheck />,
            activity: "5 VIP tickets sold for \"Underground Sessions Vol. 3\"",
            time: "2 minutes ago",
            type: "sold"
        },
        {
            id: 2,
            icon: <MdOutlineCalendarMonth />,
            activity: "\"Summer Vibes Festival\" published live",
            time: "15 minutes ago",
            type: "notif"
        },
        {
            id: 3,
            icon: <FaRegCircleCheck />,
            activity: "12 Early Bird tickets sold for \"Bass Revolution\"",
            time: "32 minutes ago",
            type: "sold"
        },
        {
            id: 4,
            icon: <FaRegCircleCheck />,
            activity: "8 Regular tickets sold for \"Jungle Takeover\"",
            time: "2 hours ago",
            type: "sold"
        },
        {
            id: 5,
            icon: <MdOutlineCalendarMonth />,
            activity: "\"AfroSpook V3 Carnival\" published live",
            time: "2 hours ago",
            type: "notif"
        }
    ]
    return (
        <div className="bg-[#151515] p-4 border border-[#27272A] rounded-2xl">
            <p className="text-[#F4F4F5] text-lg">Recent Activity</p>

            {/* Main Content */}
            <div className="flex flex-col gap-3">
                {activityData.map((item) => (
                    <GrayCard key={item.id}>
                        <div className="flex items-center gap-3">
                            {/* icon */}
                            <div className={`h-8 w-8 rounded-full p-2 flex justify-center items-center ${item.type === "notif" ? "bg-[#0F1A2A] text-[#3B82F6]" : "bg-[#00BC7D1A] text-[#00BC7D]"}`}>
                                {item.icon}
                            </div>
                            {/* content */}
                            <div className="flex flex-col gap-2">
                                <h4 className="font-semibold text-[#F4F4F5]">{item.activity}</h4>
                                <p className="text-sm text-[#71717B]">{item.time}</p>
                            </div>
                        </div>
                    </GrayCard>
                ))}
            </div>
        </div>
    )
}