
import React from 'react';
import { Surface } from 'recharts';
import { CryptoData } from '@/services/cryptoApi';
import { getCorrelationColor } from './utils';

interface CorrelationHeatmapProps {
  coins: CryptoData[];
  correlations: {
    [key: string]: {
      [key: string]: number;
    };
  };
}

export const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({
  coins,
  correlations
}) => {
  const availableCoins = coins.slice(0, 10);
  
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="grid grid-cols-[100px_1fr] gap-1">
          <div className=""></div>
          <div className="grid grid-cols-10">
            {availableCoins.map((coin) => (
              <div key={`header-${coin.id}`} className="h-10 flex items-center justify-center">
                <div className="transform -rotate-45 text-xs font-medium">{coin.symbol}</div>
              </div>
            ))}
          </div>
        </div>
        
        {availableCoins.map((coin1) => (
          <div key={`row-${coin1.id}`} className="grid grid-cols-[100px_1fr] gap-1">
            <div className="h-10 flex items-center">
              <div className="text-xs font-medium">{coin1.symbol}</div>
            </div>
            <div className="grid grid-cols-10">
              {availableCoins.map((coin2) => {
                const correlation = correlations[coin1.id]?.[coin2.id] || 0;
                return (
                  <div 
                    key={`${coin1.id}-${coin2.id}`} 
                    className="h-10 flex items-center justify-center"
                    style={{ backgroundColor: getCorrelationColor(correlation) }}
                    title={`${coin1.symbol} vs ${coin2.symbol}: ${correlation}`}
                  >
                    <span className="text-xs font-medium text-white drop-shadow-md">
                      {correlation.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
