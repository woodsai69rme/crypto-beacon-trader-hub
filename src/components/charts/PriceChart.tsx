
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceChartProps {
  coinId: string;
  height?: number;
}

// Sample data - this would typically come from an API
const sampleData = [
  { date: '2023-01', price: 16000 },
  { date: '2023-02', price: 20000 },
  { date: '2023-03', price: 18000 },
  { date: '2023-04', price: 23000 },
  { date: '2023-05', price: 26000 },
  { date: '2023-06', price: 22000 },
  { date: '2023-07', price: 24000 },
  { date: '2023-08', price: 28000 },
  { date: '2023-09', price: 30000 },
  { date: '2023-10', price: 32000 },
];

const PriceChart: React.FC<PriceChartProps> = ({ coinId, height = 300 }) => {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={sampleData}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.substring(5)}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value) => [`$${value}`, 'Price']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            activeDot={{ r: 6 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
