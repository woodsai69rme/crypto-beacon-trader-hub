
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CorrelationHeatmapProps } from '@/types/trading';

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({
  correlationData,
  coins,
  onCoinSelect
}) => {
  // Helper function to get color based on correlation value
  const getCorrelationColor = (value: number): string => {
    // Positive correlation: green scale
    if (value > 0) {
      const intensity = Math.min(Math.round(value * 255), 255);
      return `rgba(0, ${intensity}, 0, ${0.3 + value * 0.7})`;
    }
    // Negative correlation: red scale
    else {
      const intensity = Math.min(Math.round(Math.abs(value) * 255), 255);
      return `rgba(${intensity}, 0, 0, ${0.3 + Math.abs(value) * 0.7})`;
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="text-sm mb-4">
          <p>Correlation heatmap visualization</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 opacity-70"></div>
              <span className="text-xs">Negative correlation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 opacity-70"></div>
              <span className="text-xs">Positive correlation</span>
            </div>
          </div>
        </div>
        
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${coins.length}, 1fr)` }}>
          {correlationData.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="aspect-square flex items-center justify-center text-xs font-medium border border-border cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: getCorrelationColor(value) }}
                onClick={() => onCoinSelect && onCoinSelect(coins[colIndex])}
                title={`${coins[rowIndex].symbol} vs ${coins[colIndex].symbol}: ${value.toFixed(2)}`}
              >
                {value.toFixed(1)}
              </div>
            ))
          )}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {coins.map((coin, index) => (
            <div
              key={coin.id}
              className="text-xs px-2 py-1 bg-muted rounded cursor-pointer hover:bg-muted/80"
              onClick={() => onCoinSelect && onCoinSelect(coin)}
            >
              {coin.symbol}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationHeatmap;
