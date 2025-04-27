
import React from "react";
import { CryptoData } from "@/services/cryptoApi";

interface Correlation {
  [key: string]: {
    [key: string]: number;
  };
}

interface CorrelationHeatmapProps {
  coins: CryptoData[];
  correlations: Correlation;
}

export const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ coins, correlations }) => {
  // Function to get color based on correlation value
  const getCorrelationColor = (value: number): string => {
    if (value === 1) return "bg-green-500";
    if (value >= 0.8) return "bg-green-400";
    if (value >= 0.6) return "bg-green-300";
    if (value >= 0.4) return "bg-green-200";
    if (value >= 0.2) return "bg-green-100";
    if (value >= 0) return "bg-gray-100";
    if (value >= -0.2) return "bg-red-100";
    if (value >= -0.4) return "bg-red-200";
    if (value >= -0.6) return "bg-red-300";
    if (value >= -0.8) return "bg-red-400";
    return "bg-red-500";
  };
  
  const coinSymbols = coins.map(coin => coin.symbol);
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border"></th>
            {coinSymbols.map((symbol) => (
              <th key={symbol} className="p-2 text-xs font-medium border">
                {symbol}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {coinSymbols.map((rowSymbol, rowIndex) => (
            <tr key={rowSymbol}>
              <th className="p-2 text-xs font-medium border">
                {rowSymbol}
              </th>
              {coinSymbols.map((colSymbol, colIndex) => {
                const coin1 = coins[rowIndex];
                const coin2 = coins[colIndex];
                
                // If we don't have correlation data yet, show a neutral cell
                const correlationValue = 
                  correlations[coin1?.id] && 
                  correlations[coin1.id][coin2?.id] !== undefined
                    ? correlations[coin1.id][coin2.id]
                    : (rowIndex === colIndex ? 1 : 0); // Default to 1 on diagonal
                
                return (
                  <td 
                    key={`${rowSymbol}-${colSymbol}`} 
                    className={`p-0 border text-center ${getCorrelationColor(correlationValue)}`}
                  >
                    <div className="p-3 text-xs">
                      {correlationValue.toFixed(2)}
                    </div>
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
