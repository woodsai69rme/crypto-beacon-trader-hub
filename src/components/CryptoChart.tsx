
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CryptoChartData } from '@/types/trading';

interface CryptoChartProps {
  symbol: string;
  color?: string;
  data?: CryptoChartData;
}

const CryptoChart: React.FC<CryptoChartProps> = ({
  symbol,
  color = "#4ADE80",
  data
}) => {
  const [timeframe, setTimeframe] = useState<string>("1d");
  const [chartData, setChartData] = useState<{ date: string; price: number }[]>([]);
  
  useEffect(() => {
    if (data) {
      // Map the data to the format expected by the chart
      const formattedData = data.time.map((time, index) => ({
        date: new Date(time).toLocaleDateString(),
        price: data.price[index]
      }));
      
      setChartData(formattedData);
    } else {
      // Generate mock data if no data is provided
      const mockData = [];
      const basePrice = 30000 + Math.random() * 10000;
      const now = new Date();
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        mockData.push({
          date: date.toLocaleDateString(),
          price: basePrice + Math.random() * 5000 - 2500
        });
      }
      
      setChartData(mockData);
    }
  }, [data, timeframe]);

  const timeframes = [
    { value: "1h", label: "1H" },
    { value: "24h", label: "24H" },
    { value: "1d", label: "1D" },
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
    { value: "1y", label: "1Y" },
    { value: "all", label: "All" },
  ];

  const formatTooltipValue = (value: number) => {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatYAxis = (value: number) => {
    return `$${value.toLocaleString(undefined, { notation: 'compact', compactDisplay: 'short' })}`;
  };

  // Calculate if the chart is showing a gain or loss
  const firstPrice = chartData[0]?.price || 0;
  const lastPrice = chartData[chartData.length - 1]?.price || 0;
  const priceChange = lastPrice - firstPrice;
  const isPositive = priceChange >= 0;
  const lineColor = isPositive ? color : "#F87171";

  return (
    <Card className="w-full h-96 overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{symbol} Price Chart</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map((tf) => (
                  <SelectItem key={tf.value} value={tf.value}>
                    {tf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-full">
        <div className="h-full w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis 
                domain={['dataMin - 100', 'dataMax + 100']} 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                tickFormatter={formatYAxis}
                width={60}
              />
              <Tooltip 
                formatter={formatTooltipValue}
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  borderColor: 'var(--border)', 
                  borderRadius: '0.375rem'
                }}
                labelStyle={{ color: 'var(--foreground)' }}
              />
              <ReferenceLine y={firstPrice} stroke="#888" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={lineColor} 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoChart;
