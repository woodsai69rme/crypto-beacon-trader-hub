
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { CryptoData } from '@/types/trading';

interface PriceCorrelationChartProps {
  historicalPrices: Record<string, number[]>;
  selectedCoin: CryptoData;
  coins: CryptoData[];
  onCoinSelect: (coin: CryptoData) => void;
}

export const PriceCorrelationChart: React.FC<PriceCorrelationChartProps> = ({ 
  historicalPrices, 
  selectedCoin, 
  coins, 
  onCoinSelect 
}) => {
  const [comparedCoinIds, setComparedCoinIds] = useState<string[]>(['ethereum']);
  
  const handleCompareChange = (value: string) => {
    if (!comparedCoinIds.includes(value) && value !== selectedCoin.id) {
      // Limit to comparing with 2 other coins for clarity
      const newCompared = [...comparedCoinIds, value].slice(-2);
      setComparedCoinIds(newCompared);
    }
  };
  
  const removeComparison = (coinId: string) => {
    setComparedCoinIds(comparedCoinIds.filter(id => id !== coinId));
  };
  
  // Prepare chart data
  const chartData = prepareChartData(historicalPrices, selectedCoin.id, comparedCoinIds);
  
  // Generate colors for lines
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Price Correlation</h3>
            
            <div className="flex items-center gap-2">
              <Select onValueChange={handleCompareChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Compare with..." />
                </SelectTrigger>
                <SelectContent>
                  {coins
                    .filter(coin => coin.id !== selectedCoin.id && !comparedCoinIds.includes(coin.id))
                    .map(coin => (
                      <SelectItem key={coin.id} value={coin.id}>
                        {coin.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
              <span>{selectedCoin.name}</span>
              <span className="text-xs font-normal">(Main)</span>
            </div>
            
            {comparedCoinIds.map((coinId, index) => {
              const coin = coins.find(c => c.id === coinId);
              if (!coin) return null;
              
              return (
                <div 
                  key={coinId} 
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 flex items-center gap-1"
                  style={{ backgroundColor: `${colors[index + 1]}20`, color: colors[index + 1] }}
                >
                  <span>{coin.name}</span>
                  <button 
                    className="ml-1 text-xs font-bold hover:opacity-80"
                    onClick={() => removeComparison(coinId)}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number | string) => {
                    // Fix the toFixed issue - ensure value is a number before calling toFixed
                    if (typeof value === 'number') {
                      return value.toFixed(2);
                    }
                    return value;
                  }} 
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={selectedCoin.id}
                  name={selectedCoin.name}
                  stroke={colors[0]}
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                
                {comparedCoinIds.map((coinId, index) => {
                  const coin = coins.find(c => c.id === coinId);
                  if (!coin) return null;
                  
                  return (
                    <Line
                      key={coinId}
                      type="monotone"
                      dataKey={coinId}
                      name={coin.name}
                      stroke={colors[index + 1]}
                      strokeWidth={1.5}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="text-sm text-gray-500">
            {comparedCoinIds.length > 0 ? (
              <p>Comparing price movements to identify potential correlations.</p>
            ) : (
              <p>Select another coin to compare price movements.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to prepare chart data
const prepareChartData = (
  historicalPrices: Record<string, number[]>,
  mainCoinId: string,
  comparedCoinIds: string[]
) => {
  const days = historicalPrices[mainCoinId]?.length || 30;
  const result = [];
  
  for (let i = 0; i < days; i++) {
    const dataPoint: Record<string, any> = {
      day: `Day ${i + 1}`
    };
    
    dataPoint[mainCoinId] = historicalPrices[mainCoinId]?.[i] || 0;
    
    comparedCoinIds.forEach(coinId => {
      dataPoint[coinId] = historicalPrices[coinId]?.[i] || 0;
    });
    
    result.push(dataPoint);
  }
  
  return result;
};

// Add default export that points to the named export
export default PriceCorrelationChart;
