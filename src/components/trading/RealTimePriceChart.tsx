
import React, { useState, useEffect, useRef } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoinOption } from '@/types/trading';
import { Clock, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface RealTimePriceChartProps {
  coinId: string;
  availableCoins: CoinOption[];
  onSelectCoin?: (coinId: string) => void;
  selectedCoinId?: string;
  updateInterval?: number;
}

interface PricePoint {
  time: string;
  price: number;
  volume?: number;
}

const MAX_DATA_POINTS = 100;

const RealTimePriceChart: React.FC<RealTimePriceChartProps> = ({ 
  coinId, 
  availableCoins,
  onSelectCoin,
  selectedCoinId,
  updateInterval = 3000
}) => {
  const [chartData, setChartData] = useState<PricePoint[]>([]);
  const [timeframe, setTimeframe] = useState<string>("5m");
  const [chartType, setChartType] = useState<string>("line");
  const [indicatorsVisible, setIndicatorsVisible] = useState<string[]>([]);
  const [activeCoin, setActiveCoin] = useState<string>(coinId || selectedCoinId || "bitcoin");
  
  const currentCoin = availableCoins.find(coin => coin.id === activeCoin);
  const lastPrice = useRef<number>(currentCoin?.price || 0);
  const priceDirection = currentCoin?.price && lastPrice.current ? (currentCoin.price > lastPrice.current ? 'up' : 'down') : undefined;
  
  useEffect(() => {
    // Update when the coinId prop changes
    if (coinId && coinId !== activeCoin) {
      setActiveCoin(coinId);
    }
  }, [coinId]);

  useEffect(() => {
    // Update when the selectedCoinId prop changes
    if (selectedCoinId && selectedCoinId !== activeCoin) {
      setActiveCoin(selectedCoinId);
    }
  }, [selectedCoinId]);
  
  useEffect(() => {
    // Setup initial chart data with historical values
    const initData = generateHistoricalData(activeCoin);
    setChartData(initData);
    
    // Setup interval for real-time updates
    const updateTimer = setInterval(() => {
      updateChartData();
    }, updateInterval);
    
    return () => clearInterval(updateTimer);
  }, [activeCoin, updateInterval]);
  
  useEffect(() => {
    // Update the lastPrice ref when the price changes
    if (currentCoin?.price) {
      lastPrice.current = currentCoin.price;
    }
  }, [currentCoin?.price]);
  
  // Generate simulated historical data
  const generateHistoricalData = (coinId: string): PricePoint[] => {
    const coin = availableCoins.find(c => c.id === coinId);
    if (!coin) return [];
    
    const basePrice = coin.price;
    const now = new Date();
    const data: PricePoint[] = [];
    
    // Generate more or fewer points based on timeframe
    let points = 20;
    let intervalMinutes = 5;
    
    switch (timeframe) {
      case "1h":
        points = 12;
        intervalMinutes = 5;
        break;
      case "4h":
        points = 24;
        intervalMinutes = 10;
        break;
      case "1d":
        points = 24;
        intervalMinutes = 60;
        break;
      default: // 5m
        points = 20;
        intervalMinutes = 0.25;
    }
    
    for (let i = points; i > 0; i--) {
      const time = new Date(now.getTime() - (i * intervalMinutes * 60000));
      const volatility = getVolatilityForCoin(coinId);
      const randomChange = (Math.random() * 2 - 1) * volatility;
      const price = basePrice * (1 + (randomChange / 100) * i / points);
      const volume = Math.floor(Math.random() * basePrice * 100) + 1000;
      
      data.push({
        time: time.toISOString(),
        price,
        volume
      });
    }
    
    return data;
  };
  
  // Get volatility level for coin (used for generating random price changes)
  const getVolatilityForCoin = (coinId: string): number => {
    const volatilityLevels: {[key: string]: number} = {
      bitcoin: 1.2,
      ethereum: 2.0,
      solana: 4.0,
      cardano: 3.0,
      ripple: 2.5,
      dogecoin: 5.0
    };
    
    return volatilityLevels[coinId] || 2.0;
  };
  
  // Update chart with new data point
  const updateChartData = () => {
    const coin = availableCoins.find(c => c.id === activeCoin);
    if (!coin) return;
    
    const now = new Date();
    const volatility = getVolatilityForCoin(activeCoin);
    const randomChange = (Math.random() * 2 - 1) * volatility / 5;
    const lastDataPoint = chartData[chartData.length - 1];
    const lastPrice = lastDataPoint ? lastDataPoint.price : coin.price;
    
    const newPrice = lastPrice * (1 + randomChange / 100);
    const volume = Math.floor(Math.random() * coin.price * 100) + 1000;
    
    const newPoint = {
      time: now.toISOString(),
      price: newPrice,
      volume
    };
    
    setChartData(prevData => {
      const newData = [...prevData, newPoint];
      if (newData.length > MAX_DATA_POINTS) {
        return newData.slice(-MAX_DATA_POINTS);
      }
      return newData;
    });
  };
  
  // Handle coin selection change
  const handleCoinChange = (value: string) => {
    setActiveCoin(value);
    if (onSelectCoin) {
      onSelectCoin(value);
    }
  };
  
  // Format display value for timestamp based on timeframe
  const formatTimestamp = (time: string): string => {
    const date = new Date(time);
    switch (timeframe) {
      case "1d":
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case "4h":
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      default: // 5m, 1h
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  };
  
  // Calculate simple moving average
  const calculateSMA = (period: number) => {
    return chartData.map((point, index, array) => {
      if (index < period - 1) {
        return null; // Not enough data points yet
      }
      
      let sum = 0;
      for (let i = 0; i < period; i++) {
        sum += array[index - i].price;
      }
      
      return sum / period;
    });
  };
  
  // Get SMA data for indicators
  const getSMAData = () => {
    const result: { sma20?: number[], sma50?: number[] } = {};
    
    if (indicatorsVisible.includes('sma20')) {
      result.sma20 = calculateSMA(20);
    }
    
    if (indicatorsVisible.includes('sma50')) {
      result.sma50 = calculateSMA(50);
    }
    
    return result;
  };
  
  const smaData = getSMAData();
  
  // Reset chart data
  const handleResetChart = () => {
    const initData = generateHistoricalData(activeCoin);
    setChartData(initData);
  };
  
  // Format price for display
  const formatPrice = (value: number) => {
    if (value >= 1000) {
      return `$${value.toFixed(2)}`;
    } else if (value >= 1) {
      return `$${value.toFixed(4)}`;
    } else {
      return `$${value.toFixed(6)}`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex items-center gap-2">
          <Select value={activeCoin} onValueChange={handleCoinChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Coin" />
            </SelectTrigger>
            <SelectContent>
              {availableCoins.map(coin => (
                <SelectItem key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {currentCoin && (
            <div className="text-sm">
              <span className="font-medium">{formatPrice(currentCoin.price)}</span>
              
              {priceDirection && (
                <span className={`ml-2 ${priceDirection === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                  {priceDirection === 'up' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {currentCoin.changePercent !== undefined ? Math.abs(currentCoin.changePercent).toFixed(2) : '0.00'}%
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <ToggleGroup type="single" value={timeframe} onValueChange={(value) => value && setTimeframe(value)}>
            <ToggleGroupItem value="5m" size="sm">5m</ToggleGroupItem>
            <ToggleGroupItem value="1h" size="sm">1h</ToggleGroupItem>
            <ToggleGroupItem value="4h" size="sm">4h</ToggleGroupItem>
            <ToggleGroupItem value="1d" size="sm">1d</ToggleGroupItem>
          </ToggleGroup>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleResetChart}
            title="Reset Chart"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md p-4">
        <Tabs value={chartType} onValueChange={setChartType} className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="line">Line</TabsTrigger>
            <TabsTrigger value="candlestick">Candlestick</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatTimestamp} 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                domain={['dataMin', 'dataMax']} 
                tickFormatter={formatPrice}
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip 
                formatter={(value: number) => [formatPrice(value), 'Price']}
                labelFormatter={(time) => {
                  return `Time: ${new Date(time).toLocaleTimeString()}`;
                }}
              />
              <Legend />
              
              {/* Main price line */}
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#8884d8" 
                dot={false} 
                strokeWidth={2}
              />
              
              {/* SMA indicators */}
              {indicatorsVisible.includes('sma20') && (
                <Line
                  type="monotone"
                  dataKey="sma20"
                  stroke="#ff7300"
                  dot={false}
                  strokeWidth={1.5}
                  connectNulls
                />
              )}
              
              {indicatorsVisible.includes('sma50') && (
                <Line
                  type="monotone"
                  dataKey="sma50"
                  stroke="#82ca9d"
                  dot={false}
                  strokeWidth={1.5}
                  connectNulls
                />
              )}
              
              {/* Current price reference line */}
              {currentCoin && (
                <ReferenceLine 
                  y={currentCoin.price} 
                  stroke="#ff0000" 
                  strokeDasharray="3 3"
                  label={{ 
                    value: `Current: ${formatPrice(currentCoin.price)}`, 
                    position: 'right', 
                    fill: '#ff0000',
                    fontSize: 12
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Auto-updates every {updateInterval / 1000} seconds
          </span>
        </div>
        
        <ToggleGroup 
          type="multiple" 
          value={indicatorsVisible}
          onValueChange={setIndicatorsVisible}
        >
          <ToggleGroupItem value="sma20" size="sm" className="text-xs">SMA 20</ToggleGroupItem>
          <ToggleGroupItem value="sma50" size="sm" className="text-xs">SMA 50</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default RealTimePriceChart;
