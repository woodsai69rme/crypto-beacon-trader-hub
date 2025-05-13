
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/hooks/use-theme';
import { fetchCoinHistory, formatPriceHistory } from '@/services/api/coinGeckoService';
import { toast } from '@/components/ui/use-toast';
import { RefreshCw } from 'lucide-react';

interface RealTimePriceChartProps {
  coinId: string;
  coinName?: string;
  timeframe?: string;
  isLoading?: boolean;
  onTimeframeChange?: (timeframe: string) => void;
}

interface ChartData {
  time: number;
  price: number;
  marketCap?: number;
  volume?: number;
}

const timeframes = [
  { value: '1', label: '24 Hours' },
  { value: '7', label: '7 Days' },
  { value: '30', label: '30 Days' },
  { value: '90', label: '3 Months' },
  { value: '365', label: '1 Year' },
  { value: 'max', label: 'All Time' },
];

const formatDate = (timestamp: number, timeframe: string) => {
  const date = new Date(timestamp);
  
  if (timeframe === '1') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
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
  coinName,
  timeframe = '7',
  isLoading: externalIsLoading = false,
  onTimeframeChange
}) => {
  const { theme } = useTheme();
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(externalIsLoading);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'price' | 'volume' | 'market-cap'>('price');
  
  const fetchData = useCallback(async () => {
    if (!coinId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const historyData = await fetchCoinHistory(coinId, timeframe);
      const { priceData, marketCapData, volumeData } = formatPriceHistory(historyData);
      
      // Combine data for chart
      const combinedData = priceData.map((point: any, index: number) => ({
        time: point.time,
        price: point.price,
        marketCap: marketCapData[index]?.value,
        volume: volumeData[index]?.value
      }));
      
      setData(combinedData);
    } catch (err) {
      console.error(`Error fetching price history for ${coinId}:`, err);
      setError("Failed to load price data. Please try again later.");
      toast({
        title: "Data fetch failed",
        description: `Could not retrieve historical data for ${coinName || coinId}.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [coinId, timeframe, coinName]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleTimeframeChange = (value: string) => {
    if (onTimeframeChange) {
      onTimeframeChange(value);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const priceColor = theme === 'dark' ? '#4ADE80' : '#16A34A';
  const negativeColor = theme === 'dark' ? '#F87171' : '#EF4444';
  const gridColor = theme === 'dark' ? '#333333' : '#E5E7EB';
  const textColor = theme === 'dark' ? '#FFFFFF' : '#000000';
  
  // Calculate price change
  const calculatePriceChange = () => {
    if (data.length < 2) return { change: 0, percent: 0 };
    
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    const change = lastPrice - firstPrice;
    const percent = (change / firstPrice) * 100;
    
    return { change, percent };
  };
  
  const { change, percent } = calculatePriceChange();
  const isPriceUp = change >= 0;
  
  const renderChartContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={handleRefresh}>
            Try Again
          </Button>
        </div>
      );
    }
    
    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          No data available
        </div>
      );
    }
    
    // Determine y-axis domain
    const prices = data.map(point => point.price);
    const minPrice = Math.min(...prices) * 0.995;
    const maxPrice = Math.max(...prices) * 1.005;
    
    const chartData = [...data];
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'price' ? (
          <AreaChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPriceUp ? priceColor : negativeColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={isPriceUp ? priceColor : negativeColor} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis 
              dataKey="time" 
              tickFormatter={(timestamp) => formatDate(timestamp, timeframe)} 
              stroke={textColor}
              tick={{ fill: textColor }}
              dy={10}
            />
            <YAxis 
              domain={[minPrice, maxPrice]}
              tickFormatter={(value) => formatPrice(value)}
              stroke={textColor}
              tick={{ fill: textColor }}
              width={80}
            />
            <Tooltip 
              formatter={(value) => formatPrice(value as number)} 
              labelFormatter={(timestamp) => new Date(timestamp as number).toLocaleString()}
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPriceUp ? priceColor : negativeColor}
              fillOpacity={1}
              fill="url(#colorPrice)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        ) : chartType === 'volume' ? (
          <AreaChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis 
              dataKey="time" 
              tickFormatter={(timestamp) => formatDate(timestamp, timeframe)} 
              stroke={textColor}
              tick={{ fill: textColor }}
              dy={10}
            />
            <YAxis 
              dataKey="volume"
              tickFormatter={(value) => {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  notation: 'compact',
                  maximumFractionDigits: 1
                }).format(value as number);
              }}
              stroke={textColor}
              tick={{ fill: textColor }}
              width={80}
            />
            <Tooltip 
              formatter={(value) => {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format(value as number);
              }}
              labelFormatter={(timestamp) => new Date(timestamp as number).toLocaleString()}
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
              }}
            />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorVolume)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        ) : (
          <AreaChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorMC" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis 
              dataKey="time" 
              tickFormatter={(timestamp) => formatDate(timestamp, timeframe)} 
              stroke={textColor}
              tick={{ fill: textColor }}
              dy={10}
            />
            <YAxis 
              dataKey="marketCap"
              tickFormatter={(value) => {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  notation: 'compact',
                  maximumFractionDigits: 1
                }).format(value as number);
              }}
              stroke={textColor}
              tick={{ fill: textColor }}
              width={80}
            />
            <Tooltip 
              formatter={(value) => {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format(value as number);
              }}
              labelFormatter={(timestamp) => new Date(timestamp as number).toLocaleString()}
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
              }}
            />
            <Area
              type="monotone"
              dataKey="marketCap"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorMC)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">{coinName || coinId}</CardTitle>
          <CardDescription>
            {isPriceUp ? 'Up' : 'Down'} {Math.abs(percent).toFixed(2)}% in the selected period
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
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
          
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <Button 
              variant={chartType === 'price' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartType('price')}
            >
              Price
            </Button>
            <Button 
              variant={chartType === 'volume' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartType('volume')}
            >
              Volume
            </Button>
            <Button 
              variant={chartType === 'market-cap' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartType('market-cap')}
            >
              Market Cap
            </Button>
          </div>
        </div>
        
        {renderChartContent()}
        
        {data.length > 0 && chartType === 'price' && (
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
