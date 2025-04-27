import React, { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { CoinOption } from "@/types/trading";
import { startPriceMonitoring, getCurrentPrice } from "@/services/priceMonitoring";

interface RealTimePriceChartProps {
  coinId: string;
  availableCoins: CoinOption[];
  updateInterval?: number;
}

interface PriceDataPoint {
  time: string;
  price: number;
  timestamp: number;
}

const RealTimePriceChart: React.FC<RealTimePriceChartProps> = ({
  coinId,
  availableCoins,
  updateInterval = 5000
}) => {
  const [priceData, setPriceData] = useState<PriceDataPoint[]>([]);
  const [latestPrice, setLatestPrice] = useState<number | null>(null);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);
  const monitoringRef = useRef<(() => void) | null>(null);
  
  // Initialize price data
  useEffect(() => {
    const initialPrice = availableCoins.find(c => c.id === coinId)?.price || getCurrentPrice(coinId);
    setLatestPrice(initialPrice);
    
    // Create some historical data points for the chart
    const now = Date.now();
    const mockData: PriceDataPoint[] = [];
    
    // Generate data points for the last hour (one point every 5 minutes)
    for (let i = 12; i >= 0; i--) {
      const time = now - (i * 5 * 60 * 1000);
      const variation = (Math.random() * 0.1) - 0.05; // -5% to +5%
      const mockPrice = initialPrice * (1 + variation);
      
      mockData.push({
        time: new Date(time).toLocaleTimeString(),
        price: mockPrice,
        timestamp: time
      });
    }
    
    setPriceData(mockData);
    
    // Calculate initial price change
    if (mockData.length >= 2) {
      const firstPrice = mockData[0].price;
      const lastPrice = mockData[mockData.length - 1].price;
      const changePercent = ((lastPrice - firstPrice) / firstPrice) * 100;
      setPriceChangePercent(changePercent);
    }
  }, [coinId, availableCoins]);
  
  // Update real-time data
  useEffect(() => {
    // Clean up previous monitoring
    if (monitoringRef.current) {
      monitoringRef.current();
      monitoringRef.current = null;
    }
    
    // Start new monitoring for this coin
    monitoringRef.current = startPriceMonitoring(
      [coinId],
      (updatedCoins) => {
        const updatedCoin = updatedCoins.find(c => c.id === coinId);
        if (!updatedCoin) return;
        
        const newPrice = updatedCoin.price;
        setLatestPrice(newPrice);
        
        // Add new data point
        setPriceData(prevData => {
          // Keep only the most recent 100 data points (about 8 hours at 5 min intervals)
          const newData = [...prevData, {
            time: new Date().toLocaleTimeString(),
            price: newPrice,
            timestamp: Date.now()
          }];
          
          if (newData.length > 100) {
            newData.shift();
          }
          
          // Calculate new price change percentage
          if (newData.length >= 2) {
            const firstPrice = newData[0].price;
            const changePercent = ((newPrice - firstPrice) / firstPrice) * 100;
            setPriceChangePercent(changePercent);
          }
          
          return newData;
        });
      },
      updateInterval
    );
    
    // Cleanup
    return () => {
      if (monitoringRef.current) {
        monitoringRef.current();
      }
    };
  }, [coinId, updateInterval]);
  
  // Calculate visible domain for the chart
  const calculateDomain = () => {
    if (!priceData.length) return [0, 100];
    
    const prices = priceData.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    // Add some padding to the min/max
    const padding = (max - min) * 0.1;
    return [min - padding, max + padding];
  };
  
  const calculateGradientColor = () => {
    return priceChangePercent >= 0 ? 
      ["#10B981", "#ECFDF5"] : // Green gradient for positive
      ["#EF4444", "#FEF2F2"]; // Red gradient for negative
  };
  
  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded p-2 shadow-lg">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-medium">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {latestPrice && (
        <div className="flex justify-between items-center">
          <div>
            <div className="text-3xl font-bold">${latestPrice.toFixed(2)}</div>
            <div className={`text-sm ${priceChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
              <span className="text-xs text-muted-foreground ml-1">since chart start</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">
              {availableCoins.find(c => c.id === coinId)?.name}
            </div>
            <div className="text-xs text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={priceData}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={calculateGradientColor()[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={calculateGradientColor()[1]} stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              domain={calculateDomain()}
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              orientation="right"
            />
            <Tooltip content={renderCustomTooltip} />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={calculateGradientColor()[0]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
            {latestPrice && (
              <ReferenceLine 
                y={latestPrice} 
                stroke={calculateGradientColor()[0]}
                strokeDasharray="3 3"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RealTimePriceChart;
