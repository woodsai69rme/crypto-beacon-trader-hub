
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { Button } from "@/components/ui/button";
import { CryptoData } from '@/types/trading';

interface PriceCorrelationChartProps {
  coin1: CryptoData;
  coin2: CryptoData;
  historicalPrices: Record<string, number[]>;
  days?: number;
  correlation: number;
}

const PriceCorrelationChart: React.FC<PriceCorrelationChartProps> = ({
  coin1,
  coin2,
  historicalPrices,
  days = 30,
  correlation
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    if (historicalPrices && coin1 && coin2) {
      const prices1 = historicalPrices[coin1.id];
      const prices2 = historicalPrices[coin2.id];
      
      if (!prices1 || !prices2) return;
      
      const data = [];
      
      // Normalize the price series for better visualization
      const maxPrice1 = Math.max(...prices1);
      const maxPrice2 = Math.max(...prices2);
      
      for (let i = 0; i < Math.min(prices1.length, prices2.length); i++) {
        data.push({
          day: i + 1,
          [coin1.symbol]: prices1[i] / maxPrice1 * 100, // Scale to percentage of max
          [coin2.symbol]: prices2[i] / maxPrice2 * 100  // Scale to percentage of max
        });
      }
      
      setChartData(data);
    }
  }, [coin1, coin2, historicalPrices]);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            Price Correlation: {coin1.symbol.toUpperCase()} vs {coin2.symbol.toUpperCase()}
          </CardTitle>
          
          <div className="text-sm font-medium">
            Correlation: 
            <span 
              className={
                correlation > 0.7 ? "text-green-500" :
                correlation > 0.3 ? "text-blue-500" :
                correlation > -0.3 ? "text-gray-500" :
                correlation > -0.7 ? "text-amber-500" :
                "text-red-500"
              }
            > 
              {(correlation * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                label={{ value: 'Days', position: 'insideBottom', offset: -5 }} 
              />
              <YAxis label={{ value: 'Normalized Price (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)}%`, '']} 
                labelFormatter={(day) => `Day ${day}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={coin1.symbol} 
                stroke="#3b82f6" 
                name={`${coin1.name} (${coin1.symbol.toUpperCase()})`} 
                dot={false} 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey={coin2.symbol} 
                stroke="#ef4444" 
                name={`${coin2.name} (${coin2.symbol.toUpperCase()})`} 
                dot={false} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceCorrelationChart;
