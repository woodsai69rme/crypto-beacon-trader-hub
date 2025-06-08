
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CorrelationHeatmapProps } from '@/types/trading';

const CorrelationMatrix: React.FC<CorrelationHeatmapProps> = ({ 
  correlationData, 
  coins, 
  onCoinSelect 
}) => {
  const getCorrelationLevel = (value: number) => {
    if (Math.abs(value) > 0.7) return 'Strong';
    if (Math.abs(value) > 0.3) return 'Moderate';
    return 'Weak';
  };

  const getCorrelationDirection = (value: number) => {
    return value > 0 ? 'Positive' : 'Negative';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Correlation Matrix</CardTitle>
        <CardDescription>
          Detailed correlation analysis between selected assets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-left">Asset</th>
                {coins.map((coin) => (
                  <th key={coin.id} className="border p-2 text-center text-xs">
                    {coin.symbol}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {correlationData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border p-2 font-medium">
                    {coins[rowIndex]?.symbol}
                  </td>
                  {row.map((value, colIndex) => (
                    <td
                      key={colIndex}
                      className="border p-2 text-center cursor-pointer hover:bg-muted"
                      onClick={() => {
                        if (onCoinSelect && coins[colIndex]) {
                          onCoinSelect(coins[colIndex]);
                        }
                      }}
                    >
                      <div className="text-sm font-medium">
                        {value.toFixed(3)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getCorrelationLevel(value)} {getCorrelationDirection(value)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Correlation values range from -1 (perfect negative correlation) to +1 (perfect positive correlation)</p>
          <p>Click on any cell to select the corresponding asset pair</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationMatrix;
