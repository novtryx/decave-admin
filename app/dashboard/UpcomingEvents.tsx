import GrayCard from "@/components/GrayCard";
import { FaRegClock } from "react-icons/fa6";
import { MdOutlineCalendarMonth } from "react-icons/md";

export default function UpcomingEvents() {
    return (
        <div className="bg-[#151515] h-full p-4 border border-[#27272A] rounded-2xl">
            <h4 className="text-[#F4F4F5] mb-6 text-lg">Upcoming Events</h4>

            {/* Main Content */}
            <GrayCard>
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-3">
                        {/* event name */}
                        <h4 className="font-semibold">Afrospook V3 Edition</h4>
                        {/* Date and Time */}
                        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                            <div className="flex items-center gap-2">
                                <MdOutlineCalendarMonth className="text-[#9F9FA9]" />
                                <p className="text-[#9F9FA9] text-sm">Jan 12, 2026</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <FaRegClock className="text-[#9F9FA9]" />
                                <p className="text-[#9F9FA9] text-sm">21:00</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="flex flex-col gap-2">
                        <p className="text-right text-sm font-semibold">145/200</p>
                        <div className="bg-[#6F6F6F] h-3 w-32 rounded-full">
                            <div className="h-3 w-23 bg-[#0854A7] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </GrayCard>


            <GrayCard>
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-3">
                        {/* event name */}
                        <h4 className="font-semibold">Bass Revolution</h4>
                        {/* Date and Time */}
                        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                            <div className="flex items-center gap-2">
                                <MdOutlineCalendarMonth className="text-[#9F9FA9]" />
                                <p className="text-[#9F9FA9] text-sm">Jan 12, 2026</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <FaRegClock className="text-[#9F9FA9]" />
                                <p className="text-[#9F9FA9] text-sm">21:00</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="flex flex-col gap-2">
                        <p className="text-right text-sm font-semibold">89/300</p>
                        <div className="bg-[#6F6F6F] h-3 w-32 rounded-full">
                            <div className="h-3 w-9 bg-[#0854A7] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </GrayCard>

            <GrayCard>
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-3">
                        {/* event name */}
                        <h4 className="font-semibold">Summer Vibes Festival</h4>
                        {/* Date and Time */}
                        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                            <div className="flex items-center gap-2">
                                <MdOutlineCalendarMonth className="text-[#9F9FA9]" />
                                <p className="text-[#9F9FA9] text-sm">Jan 12, 2026</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <FaRegClock className="text-[#9F9FA9]" />
                                <p className="text-[#9F9FA9] text-sm">21:00</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="flex flex-col gap-2">
                        <p className="text-right text-sm font-semibold">432/500</p>
                        <div className="bg-[#6F6F6F] h-3 w-32 rounded-full">
                            <div className="h-3 w-27.5 bg-[#0854A7] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </GrayCard>
        </div>
    )
}