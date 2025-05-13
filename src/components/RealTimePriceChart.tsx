
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PricePoint } from '@/types/trading';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/hooks/use-theme';

interface RealTimePriceChartProps {
  coinId: string;
  priceData?: PricePoint[];
  timeframe?: string;
  isLoading?: boolean;
  onTimeframeChange?: (timeframe: string) => void;
}

const timeframes = [
  { value: '1h', label: '1 Hour' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '1y', label: '1 Year' },
];

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: price < 1 ? 4 : 2,
    maximumFractionDigits: price < 1 ? 6 : 2,
  }).format(price);
};

const RealTimePriceChart: React.FC<RealTimePriceChartProps> = ({
  coinId,
  priceData = [],
  timeframe = '24h',
  isLoading = false,
  onTimeframeChange
}) => {
  const { theme } = useTheme();
  const [data, setData] = useState<PricePoint[]>([]);
  
  useEffect(() => {
    if (priceData && priceData.length > 0) {
      setData(priceData);
    }
  }, [priceData]);
  
  const handleTimeframeChange = (value: string) => {
    if (onTimeframeChange) {
      onTimeframeChange(value);
    }
  };

  const priceColor = theme === 'dark' ? '#4ADE80' : '#16A34A';
  const gridColor = theme === 'dark' ? '#333333' : '#E5E7EB';
  const textColor = theme === 'dark' ? '#FFFFFF' : '#000000';
  
  return (
    <Card className="w-full h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Price Chart</CardTitle>
          <CardDescription>
            Real-time price data for {coinId}
          </CardDescription>
        </div>
        <Select
          value={timeframe}
          onValueChange={handleTimeframeChange}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            {timeframes.map((tf) => (
              <SelectItem key={tf.value} value={tf.value}>
                {tf.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatDate} 
                stroke={textColor}
                tick={{ fill: textColor }}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tickFormatter={(value) => formatPrice(value)}
                stroke={textColor}
                tick={{ fill: textColor }}
              />
              <Tooltip 
                formatter={(value) => formatPrice(value as number)} 
                labelFormatter={(timestamp) => new Date(timestamp as number).toLocaleString()}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={priceColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        
        {data.length > 0 && (
          <div className="mt-4 flex justify-between">
            <div className="text-sm">
              <span className="text-muted-foreground">Low: </span>
              <span className="font-medium">
                {formatPrice(Math.min(...data.map(point => point.price)))}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">High: </span>
              <span className="font-medium">
                {formatPrice(Math.max(...data.map(point => point.price)))}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Current: </span>
              <span className="font-medium">
                {data.length > 0 ? formatPrice(data[data.length - 1].price) : 'N/A'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimePriceChart;
