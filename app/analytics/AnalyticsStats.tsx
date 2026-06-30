import FlashCard from "@/components/dashboard/FlashCard";
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';
import { IoTicketOutline, IoCalendarOutline } from 'react-icons/io5';
import { BiLineChart } from 'react-icons/bi';

interface StatWithTrend {
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
}

interface AnalyticsStatsProps {
  data: {
    stats: {
      revenue: StatWithTrend;
      ticketsSold: StatWithTrend;
      conversionRate: StatWithTrend;
      eventsPublished: StatWithTrend;
    };
  };
}

function TrendIndicator({ stat }: { stat: StatWithTrend }) {
  if (!stat.change || stat.trend === "stable") return null;

  const isUp = stat.trend === "up";

  return (
    <div className={`flex items-center gap-1 text-sm ${isUp ? "text-green-500" : "text-red-500"}`}>
      {isUp ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
      <span>{stat.change}</span>
    </div>
  );
}

export default function AnalyticsStats({ data }: AnalyticsStatsProps) {
  const { stats } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Revenue */}
      <FlashCard>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[#B3B3B3] mb-2">Total Revenue</p>
            <h3 className="text-3xl font-bold mb-2">{stats.revenue.value}</h3>
            <TrendIndicator stat={stats.revenue} />
          </div>
          <div className="bg-yellow-600/20 p-3 rounded-lg">
            <FiDollarSign className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </FlashCard>

      {/* Tickets Sold */}
      <FlashCard>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[#B3B3B3] mb-2">Tickets Sold</p>
            <h3 className="text-3xl font-bold mb-2">{stats.ticketsSold.value}</h3>
            <TrendIndicator stat={stats.ticketsSold} />
          </div>
          <div className="bg-yellow-600/20 p-3 rounded-lg">
            <IoTicketOutline className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </FlashCard>

      {/* Conversion Rate */}
      <FlashCard>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[#B3B3B3] mb-2">Conversion Rate</p>
            <h3 className="text-3xl font-bold mb-2">{stats.conversionRate.value}</h3>
            <TrendIndicator stat={stats.conversionRate} />
          </div>
          <div className="bg-yellow-600/20 p-3 rounded-lg">
            <BiLineChart className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </FlashCard>

      {/* Events Published */}
      <FlashCard>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[#B3B3B3] mb-2">Events Published</p>
            <h3 className="text-3xl font-bold mb-2">{stats.eventsPublished.value}</h3>
            <TrendIndicator stat={stats.eventsPublished} />
          </div>
          <div className="bg-yellow-600/20 p-3 rounded-lg">
            <IoCalendarOutline className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </FlashCard>
    </div>
  );
}