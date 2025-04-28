
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart2, LineChart as LineChartIcon, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { CoinOption } from '@/types/trading';

interface RealTimePriceChartProps {
  coins: CoinOption[];
  selectedCoinId: string;
  onSelectCoin: (coinId: string) => void;
}

type ChartTimeframe = '1h' | '24h' | '7d' | '30d' | '90d' | '1y';
type ChartType = 'line' | 'area' | 'candlestick';

const CHART_COLORS = {
  primary: '#8884d8',
  secondary: '#82ca9d',
  area: 'rgba(136, 132, 216, 0.2)',
};

interface ChartData {
  name: string;
  price: number;
  volume?: number;
}

// Mock data generation
const generateMockChartData = (coin: CoinOption | undefined, timeframe: ChartTimeframe): ChartData[] => {
  if (!coin) return [];
  
  const price = coin.price;
  let dataPoints: number;
  let volatility: number;
  
  switch (timeframe) {
    case '1h':
      dataPoints = 60;
      volatility = 0.0005;
      break;
    case '24h':
      dataPoints = 24;
      volatility = 0.002;
      break;
    case '7d':
      dataPoints = 7;
      volatility = 0.01;
      break;
    case '30d':
      dataPoints = 30;
      volatility = 0.03;
      break;
    case '90d':
      dataPoints = 12;
      volatility = 0.05;
      break;
    case '1y':
      dataPoints = 12;
      volatility = 0.08;
      break;
    default:
      dataPoints = 24;
      volatility = 0.002;
  }
  
  const data: ChartData[] = [];
  let currentPrice = price * (1 - (volatility * 0.5)); // Start slightly below current price
  
  for (let i = 0; i < dataPoints; i++) {
    // Create price movement with slight upward bias
    const changePercent = (Math.random() * 2 - 0.9) * volatility;
    currentPrice = currentPrice * (1 + changePercent);
    
    // Different label formats based on timeframe
    let label = '';
    switch (timeframe) {
      case '1h':
        label = `${59 - i}m`;
        break;
      case '24h':
        label = `${23 - i}h`;
        break;
      case '7d':
        label = `${6 - i}d`;
        break;
      case '30d':
      case '90d':
        label = `${dataPoints - i - 1}`;
        break;
      case '1y':
        label = `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i % 12]}`;
        break;
    }
    
    data.push({
      name: label,
      price: currentPrice,
      volume: currentPrice * (Math.random() * 0.1 + 0.95) * 100000,
    });
  }
  
  // Ensure last point is the current price
  data.push({
    name: 'Now',
    price: price,
    volume: price * (Math.random() * 0.1 + 0.95) * 100000,
  });
  
  return data.reverse();
};

const RealTimePriceChart: React.FC<RealTimePriceChartProps> = ({ coins, selectedCoinId, onSelectCoin }) => {
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('24h');
  const [chartType, setChartType] = useState<ChartType>('area');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  
  const selectedCoin = coins.find(c => c.id === selectedCoinId);
  
  useEffect(() => {
    if (!selectedCoin) return;
    
    const data = generateMockChartData(selectedCoin, timeframe);
    setChartData(data);
    
    // Set up interval for real-time updates
    const intervalId = setInterval(() => {
      const updatedData = [...chartData];
      
      if (updatedData.length > 0) {
        // Update the last price point to simulate real-time updates
        const lastIndex = updatedData.length - 1;
        const volatility = timeframe === '1h' ? 0.0003 : 0.0001;
        const changePercent = (Math.random() * 2 - 1) * volatility;
        
        updatedData[lastIndex] = {
          ...updatedData[lastIndex],
          price: updatedData[lastIndex].price * (1 + changePercent),
        };
        
        setChartData(updatedData);
      }
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [selectedCoin, timeframe]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex flex-col">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {selectedCoin?.name} Price Chart
            </CardTitle>
            <CardDescription>
              Current price: ${selectedCoin?.price.toFixed(2)}
              {selectedCoin?.changePercent && (
                <span className={selectedCoin.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {' '}({selectedCoin.changePercent >= 0 ? '+' : ''}{selectedCoin.changePercent.toFixed(2)}%)
                </span>
              )}
            </CardDescription>
          </div>
          <Badge variant="outline" className="animate-pulse">LIVE</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Select value={selectedCoinId} onValueChange={onSelectCoin}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a coin" />
            </SelectTrigger>
            <SelectContent>
              {coins.map(coin => (
                <SelectItem key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Select value={timeframe} onValueChange={(value) => setTimeframe(value as ChartTimeframe)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">3 Months</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Tabs value={chartType} onValueChange={(value) => setChartType(value as ChartType)} className="w-[180px]">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="line" className="flex items-center">
                  <LineChartIcon className="h-3 w-3 mr-1" />
                  Line
                </TabsTrigger>
                <TabsTrigger value="area" className="flex items-center">
                  <BarChart2 className="h-3 w-3 mr-1" />
                  Area
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                <XAxis dataKey="name" />
                <YAxis 
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']} />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={CHART_COLORS.primary} 
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                <XAxis dataKey="name" />
                <YAxis 
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={CHART_COLORS.primary}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="text-center p-4 border rounded-md">
            <div className="text-sm text-muted-foreground mb-1">Market Cap</div>
            <div className="font-bold text-lg">
              ${selectedCoin?.marketCap ? (selectedCoin.marketCap / 1000000000).toFixed(2) + "B" : "N/A"}
            </div>
          </div>
          <div className="text-center p-4 border rounded-md">
            <div className="text-sm text-muted-foreground mb-1">24h Volume</div>
            <div className="font-bold text-lg">
              ${selectedCoin?.volume ? (selectedCoin.volume / 1000000).toFixed(2) + "M" : "N/A"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimePriceChart;
