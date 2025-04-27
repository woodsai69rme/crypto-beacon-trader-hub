import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CoinOption } from "@/types/trading";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { startPriceMonitoring } from '@/services/priceMonitoring';

interface PricePoint {
  time: string;
  price: number;
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
  
  useEffect(() => {
    const selectedCoin = availableCoins.find(c => c.id === coinId);
    if (!selectedCoin) return;
    
    const initialData: PricePoint[] = [];
    const now = Date.now();
    
    for (let i = 19; i >= 0; i--) {
      const time = new Date(now - (i * updateInterval));
      const noise = selectedCoin.price * 0.001 * (Math.random() * 20 - 10);
      initialData.push({
        time: time.toLocaleTimeString(),
        price: selectedCoin.price + noise
      });
    }
    
    setPriceData(initialData);
  }, [coinId]);
  
  useEffect(() => {
    if (!coinId) return;
    
    const stopMonitoring = startPriceMonitoring(
      [coinId],
      (updatedCoins) => {
        const updatedCoin = updatedCoins.find(c => c.id === coinId);
        if (updatedCoin) {
          const now = new Date();
          
          setPriceData(prevData => {
            const newData = [...prevData, { time: now.toLocaleTimeString(), price: updatedCoin.price }];
            if (newData.length > 60) {
              return newData.slice(-60);
            }
            return newData;
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
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div>
          <div className="text-2xl font-bold">
            {formatPrice(selectedCoin?.price || 0)}
          </div>
          <div className={`text-sm ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
            {isPriceUp ? '+' : ''}{priceChangePercent.toFixed(2)}%
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Last update</div>
          <div className="text-sm font-medium">{lastUpdate.toLocaleTimeString()}</div>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={priceData}
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
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="hsl(var(--primary))" 
              dot={false}
              strokeWidth={2}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-sm text-muted-foreground text-center">
        Real-time price chart for {selectedCoin?.name} ({selectedCoin?.symbol})
      </div>
    </div>
  );
};

export default RealTimePriceChart;
