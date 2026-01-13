import FlashCard from "@/components/dashboard/FlashCard"
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi"
import { MdOutlineCalendarMonth } from "react-icons/md"
import { TbCurrencyNaira, TbTicket } from "react-icons/tb"


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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {statsData.map((item) => (
                <FlashCard 
                    key={item.id}
                >
                    <div className="flex justify-between items-start">
                        {/* Title and Value */}
                        <div className="flex flex-col gap-1">
                            <p className="text-[#9F9FA9] text-sm">{item.title}</p>
                            <h4 className="text-2xl font-semibold text-[#F4F4F5]">{item.value}</h4>
                        </div>
                        {/* icon */}
                        <div className="bg-[#382802] text-[#cca33a] text-2xl rounded-xl p-3 flex items-center justify-center w-fit">
                            {item.icon}
                        </div>
                    </div>
                    {/* Trend */}
                    {item.percentValue && (

                        <div className="mt-4 w-1/2">
                        {item.percentIncrease ? (
                            <div>
                                <HiTrendingUp className="text-[#22c55e]" />
                                <p className="text-[#22C55E] text-sm">{item.percentValue} from last month</p>
                            </div>
                        ) : (
                            <div>
                                <HiTrendingDown className="text-[#ef4444]" />
                                <p className="text-[#EF4444] text-sm">{item.percentValue} from last month</p>
                            </div>
                        )}   
                    </div>
                    )}
                </FlashCard>
            ))}
        </div>
    )
}