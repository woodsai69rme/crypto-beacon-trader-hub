
import React from 'react';
import { getCorrelationColor } from './utils';

interface CorrelationHeatmapProps {
  correlationMatrix: Record<string, Record<string, number>>;
  coinNames: Record<string, string>;
  selectedCoin?: string | null;
  onCoinSelect?: (coinId: string) => void;
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({
  correlationMatrix,
  coinNames,
  selectedCoin,
  onCoinSelect
}) => {
  const coinIds = Object.keys(correlationMatrix);
  
  if (coinIds.length === 0) {
    return <div className="p-4 text-center">No correlation data available</div>;
  }
  
  // Get cell color based on correlation value
  const getCellColor = (value: number) => {
    return getCorrelationColor(value);
  };
  
  // Format correlation as percentage
  const formatCorrelation = (value: number) => {
    return `${(value * 100).toFixed(0)}%`;
  };
  
  return (
    <div className="overflow-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-background p-2 border text-left sticky left-0 z-10">Coin</th>
            {coinIds.map(id => (
              <th key={id} className="p-2 border text-center text-xs">
                {coinNames[id]?.substring(0, 3) || id.substring(0, 3)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {coinIds.map(rowId => (
            <tr key={rowId} className={selectedCoin === rowId ? 'bg-accent/20' : ''}>
              <td 
                className="p-2 border sticky left-0 bg-background z-10 font-medium cursor-pointer hover:bg-accent/20"
                onClick={() => onCoinSelect && onCoinSelect(rowId)}
              >
                {coinNames[rowId] || rowId}
              </td>
              {coinIds.map(colId => {
                const correlation = correlationMatrix[rowId][colId];
                return (
                  <td 
                    key={`${rowId}-${colId}`}
                    className="p-2 border text-center cursor-pointer"
                    style={{ backgroundColor: getCellColor(correlation) }}
                    title={`${coinNames[rowId] || rowId} to ${coinNames[colId] || colId}: ${formatCorrelation(correlation)}`}
                    onClick={() => onCoinSelect && onCoinSelect(colId)}
                  >
                    {formatCorrelation(correlation)}
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

export default CorrelationHeatmap;
