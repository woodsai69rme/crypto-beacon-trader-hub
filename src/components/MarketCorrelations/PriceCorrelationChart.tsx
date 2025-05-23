
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  const [compareCoinIds, setCompareCoinIds] = useState<string[]>([]);
  
  // Add a coin to compare list
  const handleAddCoin = (coinId: string) => {
    if (coinId && !compareCoinIds.includes(coinId) && coinId !== selectedCoin.id) {
      setCompareCoinIds([...compareCoinIds, coinId]);
    }
  };
  
  // Remove a coin from compare list
  const handleRemoveCoin = (coinId: string) => {
    setCompareCoinIds(compareCoinIds.filter(id => id !== coinId));
  };
  
  // Prepare chart data
  const chartData = useMemo(() => {
    // If we don't have historical data, return empty array
    if (!historicalPrices || !historicalPrices[selectedCoin.id]) {
      return [];
    }
    
    const baselinePrices = historicalPrices[selectedCoin.id];
    const data = baselinePrices.map((price, index) => {
      // Calculate the percentage from the first day for normalization
      const baseValue = baselinePrices[0] || 1;
      const normalizedBasePrice = (price / baseValue) * 100;
      
      const dataPoint: any = {
        day: index,
        [selectedCoin.symbol]: normalizedBasePrice.toFixed(2),
      };
      
      // Add normalized values for all comparison coins
      compareCoinIds.forEach(coinId => {
        const coin = coins.find(c => c.id === coinId);
        if (coin && historicalPrices[coinId]) {
          const compareBaseValue = historicalPrices[coinId][0] || 1;
          const normalizedValue = (historicalPrices[coinId][index] / compareBaseValue) * 100;
          dataPoint[coin.symbol] = normalizedValue.toFixed(2);
        }
      });
      
      return dataPoint;
    });
    
    return data;
  }, [historicalPrices, selectedCoin, compareCoinIds, coins]);
  
  // Generate random colors for chart lines
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  // Memo-ized color mapping
  const colorMap = useMemo(() => {
    const result: Record<string, string> = {};
    result[selectedCoin.symbol] = '#0088FE'; // Base coin always blue
    
    compareCoinIds.forEach(coinId => {
      const coin = coins.find(c => c.id === coinId);
      if (coin) {
        result[coin.symbol] = getRandomColor();
      }
    });
    
    return result;
  }, [selectedCoin, compareCoinIds, coins]);
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Price Correlation: {selectedCoin.name}</h3>
          <p className="text-sm text-gray-500">
            Compare price movements normalized to 100 at the start of the period. 
            This shows relative performance rather than absolute price.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Select onValueChange={handleAddCoin}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Add coin to compare" />
            </SelectTrigger>
            <SelectContent>
              {coins
                .filter(coin => coin.id !== selectedCoin.id && !compareCoinIds.includes(coin.id))
                .map(coin => (
                  <SelectItem key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          
          {compareCoinIds.map(coinId => {
            const coin = coins.find(c => c.id === coinId);
            if (!coin) return null;
            
            return (
              <Button
                key={coinId}
                variant="outline"
                size="sm"
                onClick={() => handleRemoveCoin(coinId)}
                className="flex items-center gap-1"
              >
                {coin.symbol} <span className="text-xs">×</span>
              </Button>
            );
          })}
        </div>
        
        <div className="w-full h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" label={{ value: 'Days', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'Normalized Price (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Normalized Price']}
                  labelFormatter={(value: number) => `Day ${value}`}
                />
                <Legend />
                
                {/* Base coin line */}
                <Line
                  type="monotone"
                  dataKey={selectedCoin.symbol}
                  stroke={colorMap[selectedCoin.symbol]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                
                {/* Comparison coin lines */}
                {compareCoinIds.map(coinId => {
                  const coin = coins.find(c => c.id === coinId);
                  if (!coin) return null;
                  
                  return (
                    <Line
                      key={coin.id}
                      type="monotone"
                      dataKey={coin.symbol}
                      stroke={colorMap[coin.symbol]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              No historical data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Make sure to also export as default
export default PriceCorrelationChart;
