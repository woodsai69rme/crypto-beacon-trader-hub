
import React from 'react';
import { getCorrelationColor } from './utils';
import { CryptoData } from '@/types/trading';
import { Tooltip } from 'react-tooltip';

interface CorrelationMatrixProps {
  correlationMatrix: Record<string, Record<string, number>>;
  coins: CryptoData[];
  onCoinSelect: (coin: CryptoData) => void;
}

export const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({ 
  correlationMatrix, 
  coins, 
  onCoinSelect 
}) => {
  if (Object.keys(correlationMatrix).length === 0) {
    return <div className="text-center py-4">Loading correlation data...</div>;
  }
  
  return (
    <div className="overflow-auto">
      <div className="min-w-[500px]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border"></th>
              {coins.map(coin => (
                <th 
                  key={coin.id} 
                  className="p-2 border text-xs font-medium"
                  onClick={() => onCoinSelect(coin)}
                >
                  {coin.symbol.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coins.map(coin => (
              <tr key={coin.id}>
                <td 
                  className="p-2 border text-xs font-medium cursor-pointer hover:bg-accent"
                  onClick={() => onCoinSelect(coin)}
                >
                  {coin.symbol.toUpperCase()}
                </td>
                {coins.map(otherCoin => {
                  const correlation = correlationMatrix[coin.id]?.[otherCoin.id] || 0;
                  const color = getCorrelationColor(correlation);
                  const displayValue = correlation === 1 ? '1.00' : correlation.toFixed(2);
                  
                  return (
                    <td 
                      key={otherCoin.id} 
                      className="p-2 border text-center text-xs cursor-pointer"
                      style={{ 
                        backgroundColor: color,
                        color: Math.abs(correlation) > 0.5 ? 'white' : 'black'
                      }}
                      data-tooltip-id="correlation-tooltip"
                      data-tooltip-content={`${coin.name} to ${otherCoin.name} correlation: ${displayValue}`}
                    >
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-red-600"></div>
            <span className="text-xs">Negative Correlation</span>
          </div>
          <div className="mx-2 text-xs">|</div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-blue-600"></div>
            <span className="text-xs">Positive Correlation</span>
          </div>
        </div>
      </div>
      
      <Tooltip id="correlation-tooltip" />
    </div>
  );
};
