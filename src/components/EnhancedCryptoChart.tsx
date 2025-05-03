
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CryptoChartData } from '@/types/trading';

interface EnhancedCryptoChartProps {
  coin: string;
  coinId: string;
  color?: string;
  data?: CryptoChartData;
}

const EnhancedCryptoChart: React.FC<EnhancedCryptoChartProps> = ({
  coin,
  coinId,
  color = "#4ADE80",
  data
}) => {
  const [timeframe, setTimeframe] = useState<string>("7d");
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<'line' | 'area' | 'candle'>('area');
  
  useEffect(() => {
    if (data) {
      // Format data from the API into chart format
      const formattedData = data.time.map((time, index) => ({
        date: new Date(time).toLocaleDateString(),
        price: data.price[index],
        volume: data.volume ? data.volume[index] : undefined
      }));
      
      setChartData(formattedData);
    } else {
      // Generate mock data if no data is provided
      generateMockChartData();
    }
  }, [data, timeframe]);

  const generateMockChartData = () => {
    const mockData = [];
    let basePrice = 30000 + Math.random() * 10000;
    const now = new Date();
    const volatility = 0.02; // 2% daily volatility
    
    // Generate more or fewer points based on timeframe
    let days = 30;
    switch (timeframe) {
      case '24h': days = 1; break;
      case '7d': days = 7; break;
      case '30d': days = 30; break;
      case '90d': days = 90; break;
      case '1y': days = 365; break;
      default: days = 30;
    }
    
    // For timeframes < 1d, generate hourly data
    const pointsPerDay = timeframe === '24h' ? 24 : 1;
    const totalPoints = days * pointsPerDay;
    
    for (let i = totalPoints; i >= 0; i--) {
      // Calculate date based on timeframe
      const date = new Date(now);
      if (timeframe === '24h') {
        date.setHours(date.getHours() - i);
      } else {
        date.setDate(date.getDate() - i);
      }
      
      // Price follows a random walk with some trend
      const changePercent = (Math.random() - 0.48) * volatility;
      basePrice = basePrice * (1 + changePercent);
      
      // Add some seasonality/patterns for realism
      const dayOfWeek = date.getDay();
      const hourOfDay = date.getHours();
      
      // Weekend effect
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        basePrice *= 0.995 + Math.random() * 0.01;
      }
      
      // Hour of day effect (for 24h timeframe)
      if (timeframe === '24h') {
        // More activity during market hours
        if (hourOfDay >= 9 && hourOfDay <= 16) {
          basePrice *= 1 + (Math.random() - 0.5) * 0.005;
        }
      }
      
      // Generate volume data - higher during price movements
      const volumeBase = 1000000 + Math.random() * 1000000;
      const volume = Math.abs(changePercent) > 0.01 
        ? volumeBase * (1 + Math.abs(changePercent) * 10)
        : volumeBase;
        
      mockData.push({
        date: timeframe === '24h' 
          ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : date.toLocaleDateString(),
        price: basePrice,
        volume: volume
      });
    }
    
    setChartData(mockData);
  };

  const timeframeOptions = [
    { value: "24h", label: "24H" },
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
    { value: "1y", label: "1Y" },
  ];

  const formatTooltipValue = (value: number) => {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatYAxis = (value: number) => {
    return `$${value.toLocaleString(undefined, { notation: 'compact', compactDisplay: 'short' })}`;
  };

  const formatVolumeValue = (value: number) => {
    return `Vol: $${value.toLocaleString(undefined, { notation: 'compact', compactDisplay: 'short' })}`;
  };

  // Calculate if the chart is showing a gain or loss
  const firstPrice = chartData[0]?.price || 0;
  const lastPrice = chartData[chartData.length - 1]?.price || 0;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;
  const isPositive = priceChange >= 0;
  const lineColor = isPositive ? color : "#F87171";

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">{coin}</CardTitle>
            <div className="mt-1 flex items-center">
              <span className="text-2xl font-bold">${lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className={`ml-2 ${isPositive ? 'profit' : 'loss'}`}>
                {isPositive ? '+' : ''}{priceChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({priceChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-1">
              {timeframeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={timeframe === option.value ? "default" : "outline"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => setTimeframe(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            
            <div className="flex space-x-1 justify-end">
              <Button
                variant={chartType === 'line' ? "default" : "outline"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setChartType('line')}
              >
                Line
              </Button>
              <Button
                variant={chartType === 'area' ? "default" : "outline"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setChartType('area')}
              >
                Area
              </Button>
              <Button
                variant={chartType === 'candle' ? "default" : "outline"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setChartType('candle')}
              >
                Candle
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="mt-4">
        <Tabs defaultValue="price" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="price">Price</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="combined">Combined</TabsTrigger>
          </TabsList>
          
          <TabsContent value="price" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={lineColor} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={lineColor} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
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
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={lineColor} 
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              ) : (
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
              )}
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="volume" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  minTickGap={30}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1e6).toFixed(1)}M`}
                  width={60}
                />
                <Tooltip 
                  formatter={formatVolumeValue}
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--border)', 
                    borderRadius: '0.375rem'
                  }}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#8884d8" 
                  fillOpacity={1}
                  fill="url(#colorVolume)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="combined" className="h-[300px]">
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
                  yAxisId="left"
                  domain={['dataMin - 100', 'dataMax + 100']} 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatYAxis}
                  width={60}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1e6).toFixed(1)}M`}
                  width={60}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'price') return formatTooltipValue(value as number);
                    if (name === 'volume') return formatVolumeValue(value as number);
                    return value;
                  }}
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--border)', 
                    borderRadius: '0.375rem'
                  }}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="price" 
                  name="Price"
                  stroke={lineColor} 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="volume" 
                  name="Volume"
                  stroke="#8884d8" 
                  strokeWidth={2} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedCryptoChart;
