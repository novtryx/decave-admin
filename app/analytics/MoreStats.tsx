import FlashCard from "@/components/dashboard/FlashCard";
import { MdOutlineHowToReg } from "react-icons/md";
import { TbReceipt2 } from "react-icons/tb";
import { FiCheckCircle } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

interface MoreStatsProps {
  checkInRate: number;
  checkInEventsConsidered: number;
  avgOrderValue: number;
  paymentCompletionRate: number;
  influencerRevenueSharePercent: number;
}

export default function MoreStats({
  checkInRate,
  checkInEventsConsidered,
  avgOrderValue,
  paymentCompletionRate,
  influencerRevenueSharePercent,
}: MoreStatsProps) {
  const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

  const cards = [
    {
      id: 1,
      title: "Check-in Rate",
      value: checkInEventsConsidered > 0 ? `${checkInRate.toFixed(1)}%` : "—",
      sub:
        checkInEventsConsidered > 0
          ? `Across ${checkInEventsConsidered} ended event${checkInEventsConsidered !== 1 ? "s" : ""}`
          : "No events have ended yet",
      icon: <MdOutlineHowToReg />,
    },
    {
      id: 2,
      title: "Avg. Order Value",
      value: formatCurrency(avgOrderValue),
      sub: "Per completed transaction",
      icon: <TbReceipt2 />,
    },
    {
      id: 3,
      title: "Payment Success Rate",
      value: `${paymentCompletionRate.toFixed(1)}%`,
      sub: "Of all transactions ever started",
      icon: <FiCheckCircle />,
    },
    {
      id: 4,
      title: "Influencer Revenue Share",
      value: `${influencerRevenueSharePercent.toFixed(1)}%`,
      sub: "Of total revenue, via referral codes",
      icon: <HiOutlineSparkles />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <FlashCard key={card.id}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#B3B3B3] mb-2">{card.title}</p>
              <h3 className="text-2xl font-bold mb-1">{card.value}</h3>
              <p className="text-xs text-[#6F6F6F]">{card.sub}</p>
            </div>
            <div className="bg-yellow-600/20 p-3 rounded-lg shrink-0">
              <span className="w-6 h-6 text-yellow-600 flex items-center justify-center text-xl">
                {card.icon}
              </span>
            </div>
          </div>
        </FlashCard>
      ))}
    </div>
  );
}