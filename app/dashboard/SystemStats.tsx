import { HiTrendingDown, HiTrendingUp } from "react-icons/hi"
import { MdOutlineCalendarMonth } from "react-icons/md"
import { TbCurrencyNaira, TbTicket } from "react-icons/tb"
import FlashCard from "@/components/dashboard/FlashCard"

export default function SystemStats() {
    const statsData = [
        {
            id: 1,
            title: "Total Ticket Sales",
            value: "2, 847",
            icon: <TbTicket/>,
            percentIncrease: true,
            percentValue: "+12.5%"
        },
        {
            id: 2,
            title: "Total Revenue",
            value: "₦200,000",
            icon: <TbCurrencyNaira />,
            percentIncrease: true,
            percentValue: "+8.2%"
        },
        {
            id: 3,
            title: "Active Event",
            value: "8",
            icon: <MdOutlineCalendarMonth />
        },
        {
            id: 4,
            title: "Avg. Ticket Price",
            value: "₦5,000",
            icon: <HiTrendingUp />,
            percentIncrease: false,
            percentValue: "-2.1%"
        }
    ]
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4">
            {statsData.map((item) => (
                <FlashCard 
                    key={item.id}
                >
                    <div className="flex justify-between items-start gap-3">
                        {/* Title and Value */}
                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                            <p className="text-[#9F9FA9] text-xs sm:text-sm truncate">{item.title}</p>
                            <h4 className="text-xl sm:text-2xl font-semibold text-[#F4F4F5] wrap-break-word">{item.value}</h4>
                        </div>
                        {/* icon */}
                        <div className="bg-[#382802] text-[#cca33a] text-xl sm:text-2xl rounded-lg sm:rounded-xl p-2 sm:p-3 flex items-center justify-center shrink-0">
                            {item.icon}
                        </div>
                    </div>
                    {/* Trend */}
                    {item.percentValue && (
                        <div className="mt-3 sm:mt-4">
                            {item.percentIncrease ? (
                                <div className="flex items-center gap-1">
                                    <HiTrendingUp className="text-[#22c55e] text-base sm:text-lg shrink-0" />
                                    <p className="text-[#22C55E] text-xs sm:text-sm">{item.percentValue} from last month</p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <HiTrendingDown className="text-[#ef4444] text-base sm:text-lg shrink-0" />
                                    <p className="text-[#EF4444] text-xs sm:text-sm">{item.percentValue} from last month</p>
                                </div>
                            )}   
                        </div>
                    )}
                </FlashCard>
            ))}
        </div>
    )
}