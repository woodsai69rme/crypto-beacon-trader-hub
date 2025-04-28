
import React from "react";
import { CryptoData } from "@/types/trading";
import { getCorrelationColor, getCorrelationDescription } from "./utils";

interface CorrelationHeatmapProps {
  coins: CryptoData[];
  correlations: Record<string, Record<string, number>>;
  isLoading: boolean;
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ 
  coins, 
  correlations, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[100px_1fr] gap-1">
            <div className=""></div>
            <div className="grid grid-cols-10">
              {coins.map((coin) => (
                <div key={`header-${coin.id}`} className="h-10 flex items-center justify-center">
                  <div className="transform -rotate-45 text-xs font-medium">{coin.symbol}</div>
                </div>
              ))}
            </div>
          </div>
          
          {coins.map((coin1) => (
            <div key={`row-${coin1.id}`} className="grid grid-cols-[100px_1fr] gap-1">
              <div className="h-10 flex items-center">
                <div className="text-xs font-medium">{coin1.symbol}</div>
              </div>
              <div className="grid grid-cols-10">
                {coins.map((coin2) => {
                  const correlation = correlations[coin1.id]?.[coin2.id] || 0;
                  return (
                    <div 
                      key={`${coin1.id}-${coin2.id}`} 
                      className="h-10 flex items-center justify-center"
                      style={{ backgroundColor: getCorrelationColor(correlation) }}
                      title={`${coin1.symbol} vs ${coin2.symbol}: ${correlation} (${getCorrelationDescription(correlation)})`}
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
      
      <div className="flex justify-center gap-8 text-sm text-muted-foreground mt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2" style={{ backgroundColor: "rgba(220, 53, 69, 0.8)" }}></div>
          <span>Strong negative correlation</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2" style={{ backgroundColor: "rgba(0, 128, 0, 0.8)" }}></div>
          <span>Strong positive correlation</span>
        </div>
      </div>
    </>
  );
};

export default CorrelationHeatmap;
