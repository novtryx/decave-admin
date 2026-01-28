import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EventsPerformanceProps {
  data: Array<{ name: string; value: number }>;
}

export default function EventsPerformance({ data }: EventsPerformanceProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-6">Event Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#666666"
            tick={{ fill: '#B3B3B3', fontSize: 12 }}
            axisLine={{ stroke: '#2a2a2a' }}
            angle={0}
            textAnchor="middle"
          />
          <YAxis 
            stroke="#666666"
            tick={{ fill: '#B3B3B3', fontSize: 12 }}
            axisLine={{ stroke: '#2a2a2a' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#2a2a2a', 
              border: '1px solid #3a3a3a',
              borderRadius: '8px',
              color: '#fff'
            }}
            cursor={{ fill: '#2a2a2a50' }}
            formatter={(value: number | undefined) => value !== undefined ? [value.toLocaleString(), 'Tickets'] : ['', '']}
          />
          <Bar 
            dataKey="value" 
            fill="#3B82F6"
            radius={[8, 8, 0, 0]}
            maxBarSize={80}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}