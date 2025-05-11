
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CryptoData } from '@/types/trading';
import { calculateCorrelation } from './utils';

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
  const [comparisonCoinId, setComparisonCoinId] = useState<string>(coins[1]?.id || '');
  
  const handleComparisonChange = (coinId: string) => {
    setComparisonCoinId(coinId);
    const coin = coins.find(c => c.id === coinId);
    if (coin) {
      // If the user selects the currently selected coin as comparison, swap them
      if (coinId === selectedCoin.id) {
        const differentCoin = coins.find(c => c.id !== coinId);
        if (differentCoin) {
          onCoinSelect(differentCoin);
        }
      }
    }
  };
  
  // Prepare chart data
  const chartData = useMemo(() => {
    if (!historicalPrices[selectedCoin.id] || !historicalPrices[comparisonCoinId]) {
      return [];
    }
    
    // Normalize the prices for better comparison
    const primaryPrices = historicalPrices[selectedCoin.id];
    const comparisonPrices = historicalPrices[comparisonCoinId];
    
    // Calculate the max price for normalization
    const primaryMax = Math.max(...primaryPrices);
    const comparisonMax = Math.max(...comparisonPrices);
    
    return primaryPrices.map((price, index) => ({
      day: `Day ${index + 1}`,
      [selectedCoin.symbol]: (price / primaryMax) * 100,
      [comparisonCoinId]: (comparisonPrices[index] / comparisonMax) * 100,
    }));
  }, [historicalPrices, selectedCoin, comparisonCoinId]);
  
  // Calculate correlation coefficient
  const correlation = useMemo(() => {
    if (!historicalPrices[selectedCoin.id] || !historicalPrices[comparisonCoinId]) {
      return 0;
    }
    
    return calculateCorrelation(
      historicalPrices[selectedCoin.id], 
      historicalPrices[comparisonCoinId]
    );
  }, [historicalPrices, selectedCoin.id, comparisonCoinId]);
  
  const correlationText = useMemo(() => {
    const abs = Math.abs(correlation);
    let strength = 'No';
    let direction = '';
    
    if (abs >= 0.8) {
      strength = 'Very strong';
    } else if (abs >= 0.6) {
      strength = 'Strong';
    } else if (abs >= 0.4) {
      strength = 'Moderate';
    } else if (abs >= 0.2) {
      strength = 'Weak';
    }
    
    direction = correlation > 0 ? 'positive' : correlation < 0 ? 'negative' : '';
    
    return `${strength} ${direction} correlation`;
  }, [correlation]);
  
  const comparisonCoin = coins.find(c => c.id === comparisonCoinId) || coins[1];
  
  if (Object.keys(historicalPrices).length === 0) {
    return <div className="text-center py-4">Loading price data...</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Price Correlation</h3>
          <p className="text-sm text-muted-foreground">
            Compare normalized prices between two assets
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <span className="text-sm">Compare with:</span>
          <Select 
            value={comparisonCoinId} 
            onValueChange={handleComparisonChange}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select coin" />
            </SelectTrigger>
            <SelectContent>
              {coins
                .filter(coin => coin.id !== selectedCoin.id)
                .map(coin => (
                  <SelectItem key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border p-4 rounded-lg">
        <div className="text-sm flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>{selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})</span>
          </div>
          <div className="flex items-center mt-2 sm:mt-0">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>{comparisonCoin?.name} ({comparisonCoin?.symbol.toUpperCase()})</span>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="day"
                tick={{ fontSize: 10 }}
                tickLine={false}
              />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 10 }}
                domain={[0, 100]}
              />
              <Tooltip 
                formatter={(value) => [`${value.toFixed(2)}%`, '']}
                labelFormatter={(label) => label}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={selectedCoin.symbol} 
                name={selectedCoin.name} 
                stroke="#3b82f6" 
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey={comparisonCoinId} 
                name={comparisonCoin?.name} 
                stroke="#10b981" 
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-center">
          <div className="bg-secondary/30 p-3 rounded-md">
            <span className="text-sm font-medium">Correlation:</span> 
            <span className={`text-lg font-bold ml-2 ${
              correlation > 0 ? 'text-green-500' : correlation < 0 ? 'text-red-500' : ''
            }`}>
              {correlation.toFixed(2)}
            </span>
            <div className="text-xs text-muted-foreground mt-1">{correlationText}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
