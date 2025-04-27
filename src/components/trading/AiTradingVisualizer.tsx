
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { toast } from "@/components/ui/use-toast";
import { TrendingDown, TrendingUp } from "lucide-react";

interface AiTradingVisualizerProps {
  botId: string;
  tradingPair: string;
  timeframe: string;
  isRunning: boolean;
}

const AiTradingVisualizer: React.FC<AiTradingVisualizerProps> = ({
  botId,
  tradingPair,
  timeframe,
  isRunning
}) => {
  const [priceData, setPriceData] = useState<any[]>([]);
  const [signals, setSignals] = useState<{
    buy: { time: string; price: number }[];
    sell: { time: string; price: number }[];
  }>({ buy: [], sell: [] });

  // Generate initial data
  useEffect(() => {
    generateData();
  }, [tradingPair, timeframe]);

  // Update data when running
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      updateData();
    }, 1500);

    return () => clearInterval(interval);
  }, [isRunning, priceData]);

  const generateData = () => {
    const initialData = [];
    const startPrice = 15000 + Math.random() * 35000;
    let currentPrice = startPrice;
    
    for (let i = 0; i < 30; i++) {
      // Random price change with slight trend
      const change = (Math.random() - 0.48) * 100;
      currentPrice = Math.max(1000, currentPrice + change);
      
      initialData.push({
        time: `${i}:00`,
        price: currentPrice,
        sma: currentPrice * (1 - Math.random() * 0.05)
      });
    }

    setPriceData(initialData);
  };

  const updateData = () => {
    if (priceData.length === 0) return;

    setPriceData(prevData => {
      // Add new data point
      const lastDataPoint = prevData[prevData.length - 1];
      const lastPrice = lastDataPoint.price;
      const newTime = parseInt(lastDataPoint.time.split(':')[0]) + 1;
      const change = (Math.random() - 0.48) * 100;
      const newPrice = Math.max(1000, lastPrice + change);
      
      const newData = [...prevData.slice(1), {
        time: `${newTime}:00`,
        price: newPrice,
        sma: newPrice * (1 - Math.random() * 0.05)
      }];

      // Maybe generate a trading signal
      if (isRunning && Math.random() > 0.8) {
        const isBuy = Math.random() > 0.5;
        const signalTime = `${newTime}:00`;
        
        setSignals(prev => {
          if (isBuy) {
            toast({
              title: "BUY Signal Generated",
              description: `${tradingPair} at $${newPrice.toFixed(2)}`,
            });
            return {
              ...prev,
              buy: [...prev.buy, { time: signalTime, price: newPrice }]
            };
          } else {
            toast({
              title: "SELL Signal Generated",
              description: `${tradingPair} at $${newPrice.toFixed(2)}`,
            });
            return {
              ...prev,
              sell: [...prev.sell, { time: signalTime, price: newPrice }]
            };
          }
        });
      }

      return newData;
    });
  };

  const formatYAxis = (tickItem: any) => {
    return `$${tickItem.toLocaleString()}`;
  };

  // Find buy/sell signal for each data point
  const getSignalForDataPoint = (time: string) => {
    const buySignal = signals.buy.find(signal => signal.time === time);
    if (buySignal) return { type: 'buy', price: buySignal.price };
    
    const sellSignal = signals.sell.find(signal => signal.time === time);
    if (sellSignal) return { type: 'sell', price: sellSignal.price };
    
    return null;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-4">
          <div className="font-medium">{tradingPair} Market Analysis</div>
          <div className="text-xs text-muted-foreground">
            {timeframe} timeframe • {isRunning ? 'Live updates' : 'Static data'}
          </div>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10 }} 
                tickFormatter={formatYAxis} 
              />
              <Tooltip 
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Price']}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#3F83F8" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 4, stroke: "#3F83F8", strokeWidth: 1, fill: "#fff" }}
              />
              <Line 
                type="monotone" 
                dataKey="sma" 
                stroke="#9061F9" 
                strokeWidth={1.5} 
                strokeDasharray="3 3" 
                dot={false}
                activeDot={{ r: 3 }}
              />
              
              {/* Buy Signals */}
              {signals.buy.map((signal, idx) => (
                <ReferenceLine 
                  key={`buy-${idx}`} 
                  x={signal.time} 
                  stroke="#10B981" 
                  strokeDasharray="3 3" 
                />
              ))}
              
              {/* Sell Signals */}
              {signals.sell.map((signal, idx) => (
                <ReferenceLine 
                  key={`sell-${idx}`} 
                  x={signal.time} 
                  stroke="#EF4444" 
                  strokeDasharray="3 3" 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Signal Legend */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2 text-xs">
            <div className="h-3 w-3 rounded-full bg-[#3F83F8]"></div>
            <span>Price</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="h-3 w-3 rounded-full bg-[#9061F9]"></div>
            <span>SMA</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-600">
            <TrendingUp className="h-3 w-3" />
            <span>Buy Signal</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-red-600">
            <TrendingDown className="h-3 w-3" />
            <span>Sell Signal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiTradingVisualizer;
