
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CorrelationHeatmapProps, CoinOption } from '@/types/trading';

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ 
  correlationData, 
  coins, 
  onCoinSelect 
}) => {
  const getCorrelationColor = (value: number) => {
    if (value > 0.7) return 'bg-green-600';
    if (value > 0.3) return 'bg-green-400';
    if (value > -0.3) return 'bg-gray-400';
    if (value > -0.7) return 'bg-red-400';
    return 'bg-red-600';
  };

  const getCorrelationText = (value: number) => {
    return Math.abs(value) < 0.1 ? '0' : value.toFixed(2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Correlation Heatmap</CardTitle>
        <CardDescription>
          Correlation coefficients between cryptocurrency assets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="grid grid-cols-1 gap-4">
              {/* Headers */}
              <div className="flex items-center gap-2">
                <div className="w-16"></div>
                {coins.map((coin) => (
                  <div
                    key={coin.id}
                    className="w-16 text-center text-xs font-medium truncate"
                  >
                    {coin.symbol}
                  </div>
                ))}
              </div>
              
              {/* Correlation Matrix */}
              {correlationData.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-2">
                  <div className="w-16 text-xs font-medium truncate">
                    {coins[rowIndex]?.symbol}
                  </div>
                  {row.map((value, colIndex) => (
                    <div
                      key={colIndex}
                      className={`w-16 h-12 flex items-center justify-center text-xs font-bold text-white cursor-pointer rounded ${getCorrelationColor(value)}`}
                      onClick={() => {
                        if (onCoinSelect && coins[colIndex]) {
                          onCoinSelect(coins[colIndex]);
                        }
                      }}
                      title={`${coins[rowIndex]?.symbol} vs ${coins[colIndex]?.symbol}: ${value.toFixed(3)}`}
                    >
                      {getCorrelationText(value)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span>Strong Negative</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span>Negative</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span>Neutral</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span>Positive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span>Strong Positive</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationHeatmap;
