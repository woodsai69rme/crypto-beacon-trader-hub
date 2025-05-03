
import React from 'react';
import { Card } from "@/components/ui/card";
import { CryptoData } from '@/types/trading';

export interface CorrelationHeatmapProps {
  data: CryptoData[];
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ data }) => {
  // Calculate correlation matrix
  const calculateCorrelation = (prices1: number[], prices2: number[]) => {
    // Simple correlation formula
    const n = Math.min(prices1.length, prices2.length);
    if (n < 2) return 0;
    
    let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0;
    
    for (let i = 0; i < n; i++) {
      sum1 += prices1[i];
      sum2 += prices2[i];
      sum1Sq += prices1[i] ** 2;
      sum2Sq += prices2[i] ** 2;
      pSum += prices1[i] * prices2[i];
    }
    
    const num = pSum - (sum1 * sum2 / n);
    const den = Math.sqrt((sum1Sq - sum1 ** 2 / n) * (sum2Sq - sum2 ** 2 / n));
    
    return den === 0 ? 0 : num / den;
  };
  
  // Mock price history for demonstration
  const generateMockPriceHistory = (coin: CryptoData, days: number = 30) => {
    const prices = [];
    let price = coin.price;
    const volatility = 0.02; // 2% daily volatility
    
    for (let i = 0; i < days; i++) {
      const change = (Math.random() * 2 - 1) * volatility;
      price = price * (1 + change);
      prices.push(price);
    }
    
    return prices;
  };
  
  // Generate price history for all coins
  const priceHistories = data.map(coin => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    prices: generateMockPriceHistory(coin)
  }));
  
  // Calculate correlation matrix
  const correlationMatrix = priceHistories.map(coin1 => {
    return priceHistories.map(coin2 => {
      return calculateCorrelation(coin1.prices, coin2.prices);
    });
  });
  
  // Color function for correlation cells
  const getCorrelationColor = (value: number) => {
    if (value === 1) return 'bg-green-600 text-white';
    if (value > 0.7) return 'bg-green-500 text-white';
    if (value > 0.4) return 'bg-green-400 text-white';
    if (value > 0.1) return 'bg-green-300 text-black';
    if (value > -0.1) return 'bg-gray-300 text-black';
    if (value > -0.4) return 'bg-red-300 text-black';
    if (value > -0.7) return 'bg-red-400 text-white';
    return 'bg-red-500 text-white';
  };
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        This heatmap shows price correlations between different cryptocurrencies.
        Greener cells indicate positive correlation, while redder cells indicate negative correlation.
      </p>
      
      <div className="overflow-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className="p-2 border text-left font-medium"></th>
              {priceHistories.map(coin => (
                <th key={coin.id} className="p-2 border text-center font-medium">
                  {coin.symbol.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {priceHistories.map((coin, rowIndex) => (
              <tr key={coin.id}>
                <td className="p-2 border font-medium">{coin.symbol.toUpperCase()}</td>
                {correlationMatrix[rowIndex].map((correlation, colIndex) => (
                  <td 
                    key={`${coin.id}-${priceHistories[colIndex].id}`} 
                    className={`p-2 border text-center ${getCorrelationColor(correlation)}`}
                  >
                    {correlation.toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-2" />
          <span className="text-xs">Strong +ve</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-300 mr-2" />
          <span className="text-xs">Weak +ve</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-300 mr-2" />
          <span className="text-xs">Neutral</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-300 mr-2" />
          <span className="text-xs">Weak -ve</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 mr-2" />
          <span className="text-xs">Strong -ve</span>
        </div>
      </div>
    </div>
  );
};

export default CorrelationHeatmap;
