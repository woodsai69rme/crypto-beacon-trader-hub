
import React from 'react';
import { CryptoData } from '@/types/trading';
import { Card } from '@/components/ui/card';

interface CorrelationMatrixProps {
  data: CryptoData[];
}

interface CorrelationCell {
  coin1: string;
  coin2: string;
  value: number;
}

const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({ data }) => {
  // Generate mock correlation data
  // In a real app, this would be calculated from price histories
  const generateCorrelationData = (): CorrelationCell[] => {
    const correlations: CorrelationCell[] = [];
    
    // We only need the top 5 coins for this visualization
    const topCoins = data.slice(0, 5);
    
    // Create a matrix of correlations
    for (let i = 0; i < topCoins.length; i++) {
      for (let j = i; j < topCoins.length; j++) {
        // If same coin, correlation is 1
        if (i === j) {
          correlations.push({
            coin1: topCoins[i].symbol.toUpperCase(),
            coin2: topCoins[j].symbol.toUpperCase(),
            value: 1
          });
        } else {
          // Generate a mock correlation value
          // In real app, this would be calculated from price data
          const baseValue = i === 0 && j === 1 ? 0.85 : Math.random(); // BTC-ETH is usually highly correlated
          const correlation = Math.round((0.3 + baseValue * 0.7) * 100) / 100;
          
          correlations.push({
            coin1: topCoins[i].symbol.toUpperCase(),
            coin2: topCoins[j].symbol.toUpperCase(),
            value: correlation
          });
          
          correlations.push({
            coin1: topCoins[j].symbol.toUpperCase(),
            coin2: topCoins[i].symbol.toUpperCase(),
            value: correlation
          });
        }
      }
    }
    
    return correlations;
  };
  
  const correlationData = generateCorrelationData();
  const uniqueCoins = Array.from(new Set(correlationData.map(item => item.coin1))).sort();
  
  const getCellClass = (value: number) => {
    if (value === 1) return 'bg-primary/20';
    if (value >= 0.8) return 'bg-green-500/80';
    if (value >= 0.6) return 'bg-green-500/60';
    if (value >= 0.4) return 'bg-green-500/40';
    if (value >= 0.2) return 'bg-green-500/20';
    if (value >= 0) return 'bg-green-500/10';
    if (value >= -0.2) return 'bg-red-500/10';
    if (value >= -0.4) return 'bg-red-500/20';
    if (value >= -0.6) return 'bg-red-500/40';
    if (value >= -0.8) return 'bg-red-500/60';
    return 'bg-red-500/80';
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-2 text-left">Asset</th>
            {uniqueCoins.map(coin => (
              <th key={coin} className="p-2 text-center">{coin}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {uniqueCoins.map(coin1 => (
            <tr key={coin1}>
              <td className="p-2 font-medium">{coin1}</td>
              {uniqueCoins.map(coin2 => {
                const cell = correlationData.find(
                  item => item.coin1 === coin1 && item.coin2 === coin2
                );
                return (
                  <td 
                    key={`${coin1}-${coin2}`} 
                    className={`p-2 text-center ${getCellClass(cell?.value || 0)}`}
                  >
                    {cell ? cell.value.toFixed(2) : 'N/A'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CorrelationMatrix;
