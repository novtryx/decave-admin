import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TicketsSoldProps {
  data: Array<{ month: string; value: number }>;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-3">
        <p className="text-sm text-[#B3B3B3] mb-1">September, 2025</p>
        <p className="text-lg font-bold text-[#3B82F6]">{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function TicketsSold({ data }: TicketsSoldProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-6">Tickets Sold</h3>
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
              if (value >= 1000) return `${value / 1000}K`;
              return value;
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 4 }}
            activeDot={{ r: 6, fill: '#3B82F6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}