import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TopEventsByRevenueProps {
  data: Array<{ name: string; value: number }>;
}

export default function TopEventsByRevenue({ data }: TopEventsByRevenueProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-1">Top Events by Revenue</h3>
      <p className="text-xs text-[#6F6F6F] mb-6">
        Ranked by money earned, not just tickets sold
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" horizontal={false} />
          <XAxis
            type="number"
            stroke="#666666"
            tick={{ fill: '#B3B3B3', fontSize: 12 }}
            axisLine={{ stroke: '#2a2a2a' }}
            tickFormatter={(value) => {
              if (value >= 1000000) return `${value / 1000000}M`;
              if (value >= 1000) return `${value / 1000}K`;
              return value;
            }}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#666666"
            tick={{ fill: '#B3B3B3', fontSize: 12 }}
            axisLine={{ stroke: '#2a2a2a' }}
            width={140}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#2a2a2a',
              border: '1px solid #3a3a3a',
              borderRadius: '8px',
              color: '#fff'
            }}
            cursor={{ fill: '#2a2a2a50' }}
            formatter={(value: number | undefined) => value !== undefined ? [`₦${value.toLocaleString()}`, 'Revenue'] : ['', '']}
          />
          <Bar
            dataKey="value"
            fill="#22C55E"
            radius={[0, 8, 8, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}