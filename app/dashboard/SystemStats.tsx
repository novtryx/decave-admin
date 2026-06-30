import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { TbCurrencyNaira, TbTicket } from "react-icons/tb";
import FlashCard from "@/components/dashboard/FlashCard";
import { MetricData, DashboardRange } from "@/types/dashboardType";

interface SystemStatsProps {
  ticketSale: MetricData;
  revenue: MetricData;
  activeEvents: MetricData;
  avgTicketPrice: MetricData;
  range: DashboardRange;
}

// Label for what the percentage change is being compared against,
// matching the currently selected range. "all" has no comparison
// period at all (there's no meaningful "previous all-time"), so it's
// handled separately below rather than going through this map.
const COMPARISON_LABEL: Record<Exclude<DashboardRange, "all">, string> = {
  month: "from last month",
  "3months": "from previous 3 months",
  year: "from last year",
};

export default function SystemStats({
  ticketSale,
  revenue,
  activeEvents,
  avgTicketPrice,
  range,
}: SystemStatsProps) {
  const formatCurrency = (value: number | undefined, currency?: string) => {
    const safeValue = value ?? 0;
    if (currency === "NGN") {
      return `₦${safeValue.toLocaleString()}`;
    }
    return safeValue.toLocaleString();
  };

  const comparisonLabel = range === "all" ? null : COMPARISON_LABEL[range];

  const statsData = [
    {
      id: 1,
      title: "Total Ticket Sales",
      value: (ticketSale.currentPeriod ?? 0).toLocaleString(),
      icon: <TbTicket />,
      metric: ticketSale,
    },
    {
      id: 2,
      title: "Total Revenue",
      value: formatCurrency(revenue.currentPeriod, revenue.currency),
      icon: <TbCurrencyNaira />,
      metric: revenue,
    },
    {
      id: 3,
      title: "Active Events",
      value: (activeEvents.currentPeriod ?? 0).toString(),
      icon: <MdOutlineCalendarMonth />,
      metric: activeEvents,
    },
    {
      id: 4,
      title: "Avg. Ticket Price",
      value: formatCurrency(avgTicketPrice.currentPeriod, avgTicketPrice.currency),
      icon: avgTicketPrice.trend === "up" ? <HiTrendingUp /> : <HiTrendingDown />,
      metric: avgTicketPrice,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4">
      {statsData.map((item) => {
        const { trend, percentageChange } = item.metric;
        // No comparison period available at all (range === "all"),
        // OR the backend response is missing/malformed these fields
        // entirely (e.g. a stale cached response or version drift) —
        // treat both the same: show "all-time total" rather than
        // crashing on a null/undefined value.
        const hasComparison = trend != null && percentageChange != null;
        const isStable = trend === "stable";

        return (
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

            {/* No comparison period at all (all-time view) */}
            {!hasComparison && (
              <div className="mt-3 sm:mt-4">
                <p className="text-[#9F9FA9] text-xs sm:text-sm">All-time total</p>
              </div>
            )}

            {/* Stable — comparison exists but change is 0% */}
            {hasComparison && isStable && (
              <div className="mt-3 sm:mt-4">
                <p className="text-[#9F9FA9] text-xs sm:text-sm">
                  No change {comparisonLabel}
                </p>
              </div>
            )}

            {/* Trending up/down */}
            {hasComparison && !isStable && (
              <div className="mt-3 sm:mt-4">
                {trend === "up" ? (
                  <div className="flex items-center gap-1">
                    <HiTrendingUp className="text-[#22c55e] text-base sm:text-lg shrink-0" />
                    <p className="text-[#22C55E] text-xs sm:text-sm">
                      {percentageChange! > 0 ? "+" : ""}
                      {percentageChange!.toFixed(1)}% {comparisonLabel}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <HiTrendingDown className="text-[#ef4444] text-base sm:text-lg shrink-0" />
                    <p className="text-[#EF4444] text-xs sm:text-sm">
                      {percentageChange!.toFixed(1)}% {comparisonLabel}
                    </p>
                  </div>
                )}
              </div>
            )}
          </FlashCard>
        );
      })}
    </div>
  );
}