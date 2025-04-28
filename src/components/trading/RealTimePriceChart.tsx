
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { CoinOption } from '@/types/trading';

export interface RealTimePriceChartProps {
  coins?: CoinOption[];
  selectedCoinId?: string;
  onSelectCoin?: (coinId: string) => void;
  updateInterval?: number;
  coinId?: string;
  availableCoins?: CoinOption[];
}

const RealTimePriceChart: React.FC<RealTimePriceChartProps> = ({ 
  coins, 
  selectedCoinId, 
  onSelectCoin, 
  updateInterval = 3000,
  coinId,
  availableCoins,
}) => {
  // Use either selectedCoinId or coinId, with selectedCoinId taking precedence
  const activeCoinId = selectedCoinId || coinId || (coins && coins.length > 0 ? coins[0].id : "bitcoin");
  
  // Use either coins or availableCoins, with coins taking precedence
  const activeCoinList = coins || availableCoins || [];
  
  const [priceData, setPriceData] = useState<{ time: string; price: number }[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  
  // Find the selected coin
  const selectedCoin = activeCoinList.find(c => c.id === activeCoinId);
  
  // Generate price data for the chart on component mount and when selected coin changes
  useEffect(() => {
    if (!selectedCoin) return;
    
    // Generate some initial price data - we'll start with the current price
    const initialData = [];
    const now = Date.now();
    const basePrice = selectedCoin.price;
    
    // Generate 20 price points going back in time from now
    for (let i = 19; i >= 0; i--) {
      // Random price with small variations around the base price
      const randomFactor = 1 + (Math.random() * 0.04 - 0.02); // +/- 2%
      initialData.push({
        time: new Date(now - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price: basePrice * randomFactor
      });
    }
    
    setPriceData(initialData);
  }, [selectedCoin]);
  
  // Update price data at regular intervals
  useEffect(() => {
    if (!selectedCoin) return;
    
    const interval = setInterval(() => {
      setIsUpdating(true);
      
      setPriceData(prevData => {
        // Get the latest price
        const newPrice = selectedCoin.price * (1 + (Math.random() * 0.02 - 0.01)); // +/- 1%
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Add new price to the end and remove oldest price
        const newData = [...prevData.slice(1), { time: now, price: newPrice }];
        return newData;
      });
      
      setIsUpdating(false);
    }, updateInterval);
    
    return () => clearInterval(interval);
  }, [selectedCoin, updateInterval]);
  
  if (!selectedCoin || priceData.length === 0) {
    return (
      <Card className="w-full h-[300px] flex items-center justify-center">
        <RefreshCw className="animate-spin h-6 w-6 text-muted-foreground" />
      </Card>
    );
  }
  
  // Calculate price change from first to last data point
  const priceChange = priceData.length > 1 ? 
    priceData[priceData.length - 1].price - priceData[0].price : 0;
  const priceChangePercent = priceData.length > 1 ?
    (priceChange / priceData[0].price) * 100 : 0;
    
  const isPriceUp = priceChange >= 0;
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium">{selectedCoin.name} ({selectedCoin.symbol})</h3>
            <div className="flex items-center">
              <span className="text-xl font-bold">${selectedCoin.price.toFixed(2)}</span>
              <div className={`ml-3 flex items-center ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
                {isPriceUp ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                <span className="text-sm">{Math.abs(priceChangePercent).toFixed(2)}%</span>
              </div>
            </div>
          </div>
          
          {isUpdating && <RefreshCw className="animate-spin h-4 w-4 text-muted-foreground" />}
        </div>
        
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                padding={{ left: 10, right: 10 }}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <ReferenceLine
                y={priceData[0].price}
                stroke="#888"
                strokeDasharray="3 3"
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPriceUp ? "#10b981" : "#ef4444"}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimePriceChart;
