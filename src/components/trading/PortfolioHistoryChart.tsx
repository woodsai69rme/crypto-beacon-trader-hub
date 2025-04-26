
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "@/utils/formatters";

interface HistoryDataPoint {
  date: string;
  value: number;
  invested: number;
}

interface PortfolioHistoryChartProps {
  data: HistoryDataPoint[];
  currency: 'USD' | 'AUD';
  isCompact?: boolean;
}

const generateMockData = (): HistoryDataPoint[] => {
  const baseDate = new Date();
  const data: HistoryDataPoint[] = [];
  let invested = 10000;
  let value = 10000;
  
  // Generate last 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    
    // Random daily change between -3% and +4%
    const dailyChange = (Math.random() * 7) - 3;
    value = value * (1 + (dailyChange / 100));
    
    // Occasional investments
    if (i % 5 === 0 && i > 0) {
      const investment = Math.floor(Math.random() * 500) + 200;
      invested += investment;
      value += investment;
    }
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(value * 100) / 100,
      invested: Math.round(invested * 100) / 100
    });
  }
  
  return data;
};

const PortfolioHistoryChart = ({ 
  data = generateMockData(), 
  currency = 'USD', 
  isCompact = false 
}: PortfolioHistoryChartProps) => {
  const latestValue = data.length > 0 ? data[data.length - 1].value : 0;
  const initialValue = data.length > 0 ? data[0].invested : 0;
  const profitLoss = latestValue - initialValue;
  const percentChange = initialValue > 0 ? ((profitLoss / initialValue) * 100) : 0;
  const isProfitPositive = profitLoss >= 0;
  
  const formatValue = (value: number) => formatCurrency(value, currency);
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Portfolio Performance</CardTitle>
        <CardDescription className="flex justify-between items-center">
          <span>30-day history</span>
          <span className={`font-medium ${isProfitPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isProfitPositive ? '+' : ''}{percentChange.toFixed(2)}%
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-2xl font-bold">
            {formatValue(latestValue)}
          </div>
          <div className={`font-medium ${isProfitPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isProfitPositive ? '+' : ''}{formatValue(profitLoss)}
          </div>
        </div>
        
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={false}
                interval={isCompact ? 6 : 2} 
              />
              <YAxis 
                tickFormatter={formatValue} 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip 
                formatter={(value) => formatValue(value as number)} 
                labelFormatter={(label) => `Date: ${label}`} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="Portfolio Value" 
                stroke="#8B5CF6" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="invested" 
                name="Invested Amount" 
                stroke="#94A3B8" 
                strokeWidth={1.5} 
                strokeDasharray="5 5" 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioHistoryChart;
