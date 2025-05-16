
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PricePoint } from '@/types/trading';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/hooks/use-theme';
import { Loader2 } from 'lucide-react';
import { useCurrency } from '@/hooks/use-currency';

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

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDateAxis = (timestamp: number, timeframe?: string): string => {
  const date = new Date(timestamp);
  
  if (timeframe === '1h') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (timeframe === '24h') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

const RealTimePriceChart: React.FC<RealTimePriceChartProps> = ({
  coinId,
  priceData = [],
  timeframe = '24h',
  isLoading: externalLoading = false,
  onTimeframeChange
}) => {
  const { resolvedTheme } = useTheme();
  const { formatValue } = useCurrency();
  const [data, setData] = useState<PricePoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(externalLoading);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (priceData && priceData.length > 0) {
      setData(priceData);
    } else {
      // In a real app, fetch data from API
      setData(generateDummyData(coinId, timeframe));
    }
  }, [coinId, timeframe, priceData]);
  
  // Generate dummy data for the chart
  const generateDummyData = (coinId: string, timeframe: string): PricePoint[] => {
    const now = Date.now();
    const dummyData: PricePoint[] = [];
    const basePrice = coinId === 'bitcoin' ? 60000 : 
                      coinId === 'ethereum' ? 3000 : 
                      coinId === 'solana' ? 150 : 1000;
    
    let points = 24; // Default for 24h
    let interval = 60 * 60 * 1000; // 1 hour in milliseconds
    
    switch (timeframe) {
      case '1h':
        points = 60;
        interval = 60 * 1000; // 1 minute
        break;
      case '7d':
        points = 7 * 24;
        break;
      case '30d':
        points = 30;
        interval = 24 * 60 * 60 * 1000; // 1 day
        break;
      case '90d':
        points = 90;
        interval = 24 * 60 * 60 * 1000; // 1 day
        break;
      case '1y':
        points = 12;
        interval = 30 * 24 * 60 * 60 * 1000; // 1 month
        break;
    }
    
    // Generate random price movements
    let price = basePrice;
    for (let i = points; i >= 0; i--) {
      const time = now - i * interval;
      
      // Add some randomness to the price
      const change = (Math.random() - 0.5) * basePrice * 0.02;
      price = Math.max(0, price + change);
      
      dummyData.push({
        time,
        price,
        volume: Math.random() * basePrice * 10
      });
    }
    
    return dummyData;
  };
  
  const handleTimeframeChange = (value: string) => {
    if (onTimeframeChange) {
      onTimeframeChange(value);
    }
  };
  
  const calculateChange = () => {
    if (data.length < 2) return { value: 0, percent: 0 };
    
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    const change = lastPrice - firstPrice;
    const percentChange = (change / firstPrice) * 100;
    
    return { value: change, percent: percentChange };
  };
  
  const change = calculateChange();
  const isPositive = change.value >= 0;
  
  const priceColor = resolvedTheme === 'dark' ? '#4ADE80' : '#16A34A';
  const gridColor = resolvedTheme === 'dark' ? '#333333' : '#E5E7EB';
  const textColor = resolvedTheme === 'dark' ? '#FFFFFF' : '#000000';
  
  return (
    <Card className="w-full h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl flex items-center">
            Price Chart
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </CardTitle>
          <CardDescription>
            {coinId.charAt(0).toUpperCase() + coinId.slice(1)} price data
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
        {isLoading && data.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={() => setData(generateDummyData(coinId, timeframe))}>Retry</Button>
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
                tickFormatter={(value) => formatDateAxis(value, timeframe)} 
                stroke={textColor}
                tick={{ fill: textColor }}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tickFormatter={(value) => formatValue(value)}
                stroke={textColor}
                tick={{ fill: textColor }}
              />
              <Tooltip 
                formatter={(value) => formatValue(value as number)} 
                labelFormatter={(timestamp) => new Date(timestamp as number).toLocaleString()}
                contentStyle={{
                  backgroundColor: resolvedTheme === 'dark' ? '#1F2937' : '#FFFFFF',
                  borderColor: gridColor
                }}
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
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Low: </span>
              <span className="font-medium">
                {formatValue(Math.min(...data.map(point => point.price)))}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">High: </span>
              <span className="font-medium">
                {formatValue(Math.max(...data.map(point => point.price)))}
              </span>
            </div>
            <div className="text-sm text-right">
              <span className="text-muted-foreground">Change: </span>
              <span className={`font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{change.percent.toFixed(2)}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimePriceChart;
