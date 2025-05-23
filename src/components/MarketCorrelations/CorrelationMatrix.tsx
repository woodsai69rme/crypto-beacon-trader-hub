
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CryptoData } from '@/types/trading';

interface CorrelationMatrixProps {
  correlationData: number[][];
  coins: CryptoData[];
  onCoinSelect?: (coin: CryptoData) => void;
}

const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({
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
    <Card className="w-full overflow-auto">
      <CardContent className="p-4">
        <div className="text-sm mb-2">
          <p>Correlation values range from -1 (perfectly negative) to +1 (perfectly positive)</p>
        </div>
        <div className="relative overflow-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 bg-background z-10 p-2 border border-border"></th>
                {coins.map((coin) => (
                  <th key={coin.id} className="p-2 border border-border whitespace-nowrap text-xs">
                    {coin.symbol}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {correlationData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <th 
                    className="sticky left-0 bg-background z-10 p-2 border border-border whitespace-nowrap text-xs"
                    onClick={() => onCoinSelect && onCoinSelect(coins[rowIndex])}
                  >
                    {coins[rowIndex].symbol}
                  </th>
                  {row.map((value, colIndex) => (
                    <td 
                      key={colIndex}
                      className="p-2 border border-border text-center"
                      style={{ 
                        backgroundColor: getCorrelationColor(value),
                        cursor: onCoinSelect ? 'pointer' : 'default'
                      }}
                      onClick={() => onCoinSelect && onCoinSelect(coins[colIndex])}
                    >
                      {value.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationMatrix;
