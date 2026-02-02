


import FlashCard from "@/components/dashboard/FlashCard";
import { FiTrendingUp, FiDollarSign } from 'react-icons/fi';
import { IoTicketOutline, IoCalendarOutline } from 'react-icons/io5';
import { BiLineChart } from 'react-icons/bi';

interface AnalyticsStatsProps {
  data: {
    stats: {
      revenue: { value: string; change: string };
      ticketsSold: { value: string; change: string };
      conversionRate: { value: string; change: string };
      eventsPublished: { value: string; change: string };
    };
  };
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
            {stats.revenue.change && (
              <div className="flex items-center gap-1 text-sm text-green-500">
                <FiTrendingUp className="w-4 h-4" />
                <span>{stats.revenue.change}</span>
              </div>
            )}
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
            {stats.ticketsSold.change && (
              <div className="flex items-center gap-1 text-sm text-green-500">
                <FiTrendingUp className="w-4 h-4" />
                <span>{stats.ticketsSold.change}</span>
              </div>
            )}
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
            {stats.conversionRate.change && (
              <div className="flex items-center gap-1 text-sm text-green-500">
                <FiTrendingUp className="w-4 h-4" />
                <span>{stats.conversionRate.change}</span>
              </div>
            )}
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
            {stats.eventsPublished.change && (
              <div className="flex items-center gap-1 text-sm text-green-500">
                <FiTrendingUp className="w-4 h-4" />
                <span>{stats.eventsPublished.change}</span>
              </div>
            )}
          </div>
          <div className="bg-yellow-600/20 p-3 rounded-lg">
            <IoCalendarOutline className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </FlashCard>
    </div>
  );
}