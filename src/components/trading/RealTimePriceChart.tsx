import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CoinOption } from "@/types/trading";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { startPriceMonitoring } from '@/services/priceMonitoring';
import { Activity, Clock, ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PricePoint {
  time: string;
  price: number;
  ma5?: number;
  ma20?: number;
  volume?: number;
}

interface RealTimePriceChartProps {
  coinId: string;
  availableCoins: CoinOption[];
  updateInterval?: number;
}

const RealTimePriceChart: React.FC<RealTimePriceChartProps> = ({ 
  coinId, 
  availableCoins,
  updateInterval = 5000
}) => {
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showMA, setShowMA] = useState<boolean>(true);
  const [chartInterval, setChartInterval] = useState<string>("5m");
  const [chartView, setChartView] = useState<string>("price");
  
  const calculateMovingAverages = (data: PricePoint[]) => {
    return data.map((point, index) => {
      let ma5 = null;
      if (index >= 4) {
        ma5 = data.slice(index - 4, index + 1).reduce((sum, p) => sum + p.price, 0) / 5;
      }
      
      let ma20 = null;
      if (index >= 19) {
        ma20 = data.slice(index - 19, index + 1).reduce((sum, p) => sum + p.price, 0) / 20;
      }
      
      return { ...point, ma5, ma20 };
    });
  };
  
  useEffect(() => {
    const selectedCoin = availableCoins.find(c => c.id === coinId);
    if (!selectedCoin) return;
    
    const initialData: PricePoint[] = [];
    const now = Date.now();
    
    for (let i = 19; i >= 0; i--) {
      const time = new Date(now - (i * updateInterval));
      const noise = selectedCoin.price * 0.001 * (Math.random() * 20 - 10);
      const volume = Math.random() * selectedCoin.price * 0.05 * 1000;
      
      initialData.push({
        time: time.toLocaleTimeString(),
        price: selectedCoin.price + noise,
        volume
      });
    }
    
    const dataWithMA = calculateMovingAverages(initialData);
    setPriceData(dataWithMA);
  }, [coinId]);
  
  useEffect(() => {
    if (!coinId) return;
    
    const stopMonitoring = startPriceMonitoring(
      [coinId],
      (updatedCoins) => {
        const updatedCoin = updatedCoins.find(c => c.id === coinId);
        if (updatedCoin) {
          const now = new Date();
          const volume = Math.random() * updatedCoin.price * 0.05 * 1000;
          
          setPriceData(prevData => {
            const newData = [...prevData, { 
              time: now.toLocaleTimeString(), 
              price: updatedCoin.price,
              volume
            }];
            
            const trimmedData = newData.length > 60 ? newData.slice(-60) : newData;
            
            return calculateMovingAverages(trimmedData);
          });
          
          setLastUpdate(now);
        }
      },
      updateInterval
    );
    
    return () => stopMonitoring();
  }, [coinId, updateInterval]);
  
  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toFixed(4)}`;
    }
  };
  
  const selectedCoin = availableCoins.find(c => c.id === coinId);
  const priceChangePercent = selectedCoin?.changePercent || 0;
  const isPriceUp = priceChangePercent >= 0;
  
  const filteredData = useMemo(() => {
    const intervalMap: Record<string, number> = {
      "1m": 12,
      "5m": 60,
      "15m": 180,
      "30m": 360,
      "1h": 720
    };
    
    const dataPoints = intervalMap[chartInterval] || 60;
    return priceData.slice(-dataPoints);
  }, [priceData, chartInterval]);
  
  const priceStats = useMemo(() => {
    if (filteredData.length === 0) return { high: 0, low: 0, avg: 0 };
    
    const prices = filteredData.map(d => d.price);
    return {
      high: Math.max(...prices),
      low: Math.min(...prices),
      avg: prices.reduce((sum, price) => sum + price, 0) / prices.length
    };
  }, [filteredData]);
  
  const handleRefresh = () => {
    toast({
      title: "Refreshing Chart Data",
      description: "Chart data is being updated..."
    });
    
    const selectedCoin = availableCoins.find(c => c.id === coinId);
    if (selectedCoin) {
      const initialData: PricePoint[] = [];
      const now = Date.now();
      
      for (let i = 19; i >= 0; i--) {
        const time = new Date(now - (i * updateInterval));
        const noise = selectedCoin.price * 0.001 * (Math.random() * 20 - 10);
        const volume = Math.random() * selectedCoin.price * 0.05 * 1000;
        
        initialData.push({
          time: time.toLocaleTimeString(),
          price: selectedCoin.price + noise,
          volume
        });
      }
      
      const dataWithMA = calculateMovingAverages(initialData);
      setPriceData(dataWithMA);
      setLastUpdate(new Date());
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-2xl font-bold">
            {formatPrice(selectedCoin?.price || 0)}
          </div>
          <div className={`text-sm flex items-center ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
            {isPriceUp ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            {Math.abs(priceChangePercent).toFixed(2)}%
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" /> Last update
          </div>
          <div className="text-sm font-medium flex items-center">
            {lastUpdate.toLocaleTimeString()}
            <Button size="icon" variant="ghost" className="h-6 w-6 ml-1" onClick={handleRefresh}>
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center gap-2">
        <Tabs defaultValue="price" className="w-full" value={chartView} onValueChange={setChartView}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="price">Price Chart</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Select value={chartInterval} onValueChange={setChartInterval}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Interval" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">1m</SelectItem>
            <SelectItem value="5m">5m</SelectItem>
            <SelectItem value="15m">15m</SelectItem>
            <SelectItem value="30m">30m</SelectItem>
            <SelectItem value="1h">1h</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-[300px] w-full">
        <TabsContent value="price" className="h-full mt-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => {
                  return value;
                }}
                minTickGap={50}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => formatPrice(value)}
                width={80}
              />
              <Tooltip 
                formatter={(value: number) => [formatPrice(value), 'Price']} 
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="price" 
                name="Price"
                stroke="hsl(var(--primary))" 
                dot={false}
                strokeWidth={2}
                animationDuration={300}
              />
              {showMA && (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="ma5" 
                    name="MA (5)"
                    stroke="#22c55e" 
                    dot={false}
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ma20" 
                    name="MA (20)"
                    stroke="#3b82f6" 
                    dot={false}
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                  />
                </>
              )}
              <ReferenceLine y={priceStats.avg} stroke="#9ca3af" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="volume" className="h-full mt-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10 }}
                minTickGap={50}
              />
              <YAxis 
                domain={[0, 'auto']} 
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => `$${(value/1000).toFixed(1)}K`}
                width={80}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']} 
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="volume" 
                name="Trading Volume"
                stroke="#a855f7" 
                fill="#a855f7"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-muted/40 p-2 rounded-md">
          <div className="text-muted-foreground">24h High</div>
          <div className="font-semibold">{formatPrice(priceStats.high)}</div>
        </div>
        <div className="bg-muted/40 p-2 rounded-md">
          <div className="text-muted-foreground">24h Low</div>
          <div className="font-semibold">{formatPrice(priceStats.low)}</div>
        </div>
        <div className="bg-muted/40 p-2 rounded-md">
          <div className="text-muted-foreground">24h Avg</div>
          <div className="font-semibold">{formatPrice(priceStats.avg)}</div>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground text-center flex items-center justify-center">
        <Activity className="h-3 w-3 mr-1" />
        Real-time price chart for {selectedCoin?.name} ({selectedCoin?.symbol})
      </div>
    </div>
  );
};

export default RealTimePriceChart;
