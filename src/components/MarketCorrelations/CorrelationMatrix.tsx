
import React from 'react';
import { CryptoData } from '@/types/trading';

interface CorrelationMatrixProps {
  correlationMatrix: Record<string, Record<string, number>>;
  coins: CryptoData[];
  onCoinSelect: (coin: CryptoData) => void;
}

const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({ 
  correlationMatrix, 
  coins, 
  onCoinSelect 
}) => {
  // Helper to get color based on correlation value
  const getCorrelationColor = (value: number): string => {
    if (value >= 0.8) return 'bg-green-700 text-white';
    if (value >= 0.5) return 'bg-green-500 text-white';
    if (value >= 0.2) return 'bg-green-300';
    if (value >= -0.2) return 'bg-gray-200';
    if (value >= -0.5) return 'bg-red-300';
    if (value >= -0.8) return 'bg-red-500 text-white';
    return 'bg-red-700 text-white';
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead>
          <tr>
            <th className="p-2 text-left bg-muted">Coin</th>
            {coins.map(coin => (
              <th key={coin.id} className="p-2 text-center bg-muted">
                {coin.symbol}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {coins.map(rowCoin => (
            <tr key={rowCoin.id} onClick={() => onCoinSelect(rowCoin)} className="cursor-pointer hover:bg-muted/50">
              <td className="p-2 font-medium">{rowCoin.symbol}</td>
              {coins.map(colCoin => {
                const value = correlationMatrix[rowCoin.id]?.[colCoin.id] || 0;
                return (
                  <td 
                    key={colCoin.id} 
                    className={`p-2 text-center ${getCorrelationColor(value)}`}
                  >
                    {value.toFixed(2)}
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
