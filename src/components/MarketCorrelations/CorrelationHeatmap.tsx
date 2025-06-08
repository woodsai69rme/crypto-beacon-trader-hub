
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CorrelationHeatmapProps } from '@/types/trading';

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ 
  correlationData, 
  coins, 
  onCoinSelect 
}) => {
  const getColorIntensity = (value: number) => {
    const intensity = Math.abs(value);
    if (value > 0) {
      return `rgba(34, 197, 94, ${intensity})`;
    } else {
      return `rgba(239, 68, 68, ${intensity})`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Correlation Heatmap</CardTitle>
        <CardDescription>
          Visual representation of asset correlations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-auto gap-1 min-w-fit">
            {correlationData.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1">
                {row.map((value, colIndex) => (
                  <div
                    key={colIndex}
                    className="w-12 h-12 flex items-center justify-center text-xs font-medium cursor-pointer rounded"
                    style={{ backgroundColor: getColorIntensity(value) }}
                    onClick={() => {
                      if (onCoinSelect && coins[colIndex]) {
                        onCoinSelect(coins[colIndex]);
                      }
                    }}
                    title={`${coins[rowIndex]?.symbol} vs ${coins[colIndex]?.symbol}: ${value.toFixed(3)}`}
                  >
                    {value.toFixed(2)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Positive Correlation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Negative Correlation</span>
            </div>
          </div>
          <span className="text-muted-foreground">Click cells to select assets</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationHeatmap;
