import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PricePoint } from '@/types/trading';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/hooks/use-theme';
import { fetchCoinHistory, formatPrice } from '@/services/cryptoService';
import { Loader2 } from 'lucide-react';

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
  const [data, setData] = useState<PricePoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(externalLoading);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // If external data is provided, use it
    if (priceData && priceData.length > 0) {
      setData(priceData);
    } else {
      // Otherwise, fetch data ourselves
      fetchData();
    }
    
    // Set up interval for refreshing data
    const interval = setInterval(fetchData, timeframeToRefreshInterval(timeframe));
    
    return () => clearInterval(interval);
  }, [coinId, timeframe]);
  
  const fetchData = async () => {
    if (priceData && priceData.length > 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const days = timeframeToDays(timeframe);
      const historyData = await fetchCoinHistory(coinId, days);
      setData(historyData);
    } catch (err) {
      console.error('Error fetching price data:', err);
      setError('Failed to load price data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTimeframeChange = (value: string) => {
    if (onTimeframeChange) {
      onTimeframeChange(value);
    }
  };
  
  const timeframeToDays = (tf: string): number => {
    switch (tf) {
      case '1h': return 0.042; // 1 hour in days
      case '24h': return 1;
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      default: return 1;
    }
  };
  
  const timeframeToRefreshInterval = (tf: string): number => {
    switch (tf) {
      case '1h': return 10000; // 10 seconds
      case '24h': return 30000; // 30 seconds
      case '7d': return 60000; // 1 minute
      default: return 300000; // 5 minutes
    }
  };

  const priceColor = resolvedTheme === 'dark' ? '#4ADE80' : '#16A34A';
  const gridColor = resolvedTheme === 'dark' ? '#333333' : '#E5E7EB';
  const textColor = resolvedTheme === 'dark' ? '#FFFFFF' : '#000000';
  
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
            <Button variant="outline" onClick={fetchData}>Retry</Button>
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
                tickFormatter={(value) => formatPrice(value)}
                stroke={textColor}
                tick={{ fill: textColor }}
              />
              <Tooltip 
                formatter={(value) => formatPrice(value as number)} 
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
                {formatPrice(Math.min(...data.map(point => point.price)))}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">High: </span>
              <span className="font-medium">
                {formatPrice(Math.max(...data.map(point => point.price)))}
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
