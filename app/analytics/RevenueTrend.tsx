import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueTrendProps {
  data: Array<{ month: string; value: number }>;
}

export default function RevenueTrend({ data }: RevenueTrendProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-6">Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="#666666"
            tick={{ fill: '#B3B3B3', fontSize: 12 }}
            axisLine={{ stroke: '#2a2a2a' }}
          />
          <YAxis 
            stroke="#666666"
            tick={{ fill: '#B3B3B3', fontSize: 12 }}
            axisLine={{ stroke: '#2a2a2a' }}
            tickFormatter={(value) => {
              if (value >= 1000000) return `${value / 1000000}M`;
              if (value >= 1000) return `${value / 1000}K`;
              return value;
            }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#2a2a2a', 
              border: '1px solid #3a3a3a',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: number | undefined) => value !== undefined ? [`₦${value.toLocaleString()}`, 'Revenue'] : ['', '']}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#D4A017"
            strokeWidth={2}
            dot={{ fill: '#D4A017', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}