import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { TbCurrencyNaira, TbTicket } from "react-icons/tb";
import FlashCard from "@/components/dashboard/FlashCard";

interface MetricData {
  currentMonth: number;
  lastMonth: number;
  percentageChange: number;
  trend: "up" | "down";
  currency?: string;
}

interface SystemStatsProps {
  ticketSale: MetricData;
  revenue: MetricData;
  activeEvents: MetricData;
  avgTicketPrice: MetricData;
}

export default function SystemStats({
  ticketSale,
  revenue,
  activeEvents,
  avgTicketPrice,
}: SystemStatsProps) {
  const formatCurrency = (value: number, currency?: string) => {
    if (currency === "NGN") {
      return `₦${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  const statsData = [
    {
      id: 1,
      title: "Total Ticket Sales",
      value: ticketSale.currentMonth.toLocaleString(),
      icon: <TbTicket />,
      percentIncrease: ticketSale.trend === "up",
      percentValue: `${ticketSale.percentageChange > 0 ? "+" : ""}${ticketSale.percentageChange.toFixed(1)}%`,
      hasPercent: true,
    },
    {
      id: 2,
      title: "Total Revenue",
      value: formatCurrency(revenue.currentMonth, revenue.currency),
      icon: <TbCurrencyNaira />,
      percentIncrease: revenue.trend === "up",
      percentValue: `${revenue.percentageChange > 0 ? "+" : ""}${revenue.percentageChange.toFixed(1)}%`,
      hasPercent: true,
    },
    {
      id: 3,
      title: "Active Events",
      value: activeEvents.currentMonth.toString(),
      icon: <MdOutlineCalendarMonth />,
      percentIncrease: activeEvents.trend === "up",
      percentValue: `${activeEvents.percentageChange > 0 ? "+" : ""}${activeEvents.percentageChange.toFixed(1)}%`,
      hasPercent: true,
    },
    {
      id: 4,
      title: "Avg. Ticket Price",
      value: formatCurrency(avgTicketPrice.currentMonth, avgTicketPrice.currency),
      icon: avgTicketPrice.trend === "up" ? <HiTrendingUp /> : <HiTrendingDown />,
      percentIncrease: avgTicketPrice.trend === "up",
      percentValue: `${avgTicketPrice.percentageChange > 0 ? "+" : ""}${avgTicketPrice.percentageChange.toFixed(1)}%`,
      hasPercent: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4">
      {statsData.map((item) => (
        <FlashCard key={item.id}>
          <div className="flex justify-between items-start gap-3">
            {/* Title and Value */}
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <p className="text-[#9F9FA9] text-xs sm:text-sm truncate">
                {item.title}
              </p>
              <h4 className="text-xl sm:text-2xl font-semibold text-[#F4F4F5] wrap-break-word">
                {item.value}
              </h4>
            </div>
            {/* icon */}
            <div className="bg-[#382802] text-[#cca33a] text-xl sm:text-2xl rounded-lg sm:rounded-xl p-2 sm:p-3 flex items-center justify-center shrink-0">
              {item.icon}
            </div>
          </div>
          {/* Trend */}
          {item.hasPercent && (
            <div className="mt-3 sm:mt-4">
              {item.percentIncrease ? (
                <div className="flex items-center gap-1">
                  <HiTrendingUp className="text-[#22c55e] text-base sm:text-lg shrink-0" />
                  <p className="text-[#22C55E] text-xs sm:text-sm">
                    {item.percentValue} from last month
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <HiTrendingDown className="text-[#ef4444] text-base sm:text-lg shrink-0" />
                  <p className="text-[#EF4444] text-xs sm:text-sm">
                    {item.percentValue} from last month
                  </p>
                </div>
              )}
            </div>
          )}
        </FlashCard>
      ))}
    </div>
  );
}