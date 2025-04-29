
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CryptoData } from "@/types/trading";
import { getCorrelationColor, formatCorrelation } from "./utils";

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
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (coins.length === 0 || Object.keys(correlations).length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No correlation data available</p>
      </div>
    );
  }

  return (
    <Card className="overflow-auto">
      <CardContent className="p-4">
        <div className="grid grid-cols-[auto_repeat(var(--columns),1fr)]" style={{ "--columns": coins.length } as React.CSSProperties}>
          {/* Top header row with coin symbols */}
          <div className="font-bold p-2 border-b border-r text-center"></div>
          {coins.map((coin) => (
            <div 
              key={`header-${coin.id}`} 
              className="font-bold p-2 border-b text-center"
              title={coin.name}
            >
              {coin.symbol.toUpperCase()}
            </div>
          ))}
          
          {/* Rows for each coin */}
          {coins.map((coin1) => (
            <React.Fragment key={`row-${coin1.id}`}>
              {/* Left header column with coin symbol */}
              <div 
                className="font-bold p-2 border-r text-center"
                title={coin1.name}
              >
                {coin1.symbol.toUpperCase()}
              </div>
              
              {/* Correlation cells */}
              {coins.map((coin2) => {
                const correlation = correlations[coin1.id]?.[coin2.id] || 0;
                const colorClass = getCorrelationColor(correlation);
                
                return (
                  <div 
                    key={`cell-${coin1.id}-${coin2.id}`}
                    className={`p-2 text-center ${colorClass} border border-white/10`}
                    title={`Correlation between ${coin1.symbol.toUpperCase()} and ${coin2.symbol.toUpperCase()}: ${formatCorrelation(correlation)}`}
                  >
                    {formatCorrelation(correlation)}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center text-xs">
            <span className="w-4 h-4 bg-red-800 inline-block mr-1"></span>
            <span className="mr-2">-1.0</span>
            <span className="w-4 h-4 bg-red-600 inline-block mr-1"></span>
            <span className="w-4 h-4 bg-red-400 inline-block mr-1"></span>
            <span className="w-4 h-4 bg-gray-200 inline-block mr-1"></span>
            <span className="w-4 h-4 bg-green-400 inline-block mr-1"></span>
            <span className="w-4 h-4 bg-green-600 inline-block mr-1"></span>
            <span className="w-4 h-4 bg-green-800 inline-block mr-1"></span>
            <span>1.0</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Correlation coefficient: -1.0 (perfect negative) to 1.0 (perfect positive)
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationHeatmap;
