
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CoinOption } from '@/types/trading';

// Use the interface from types/trading.d.ts
interface RealTimePriceChartProps {
  selectedCoinId: string;
  onSelectCoin: (coinId: string) => void;
  coinId?: string;
  availableCoins?: CoinOption[];
}

const RealTimePriceChart: React.FC<RealTimePriceChartProps> = ({ 
  selectedCoinId,
  onSelectCoin,
  availableCoins = []
}) => {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    // Mock real-time data updates
    const intervalId = setInterval(() => {
      setChartData(prevData => {
        const newDataPoint = {
          time: new Date().toLocaleTimeString(),
          price: Math.random() * 100 + 100 // Mock price data
        };
        return [...prevData.slice(-9), newDataPoint]; // Keep only the last 10 data points
      });
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Price Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedCoinId} onValueChange={onSelectCoin}>
          <SelectTrigger>
            <SelectValue placeholder="Select a coin" />
          </SelectTrigger>
          <SelectContent>
            {availableCoins.map((coin) => (
              <SelectItem key={coin.id} value={coin.id}>
                {coin.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RealTimePriceChart;
