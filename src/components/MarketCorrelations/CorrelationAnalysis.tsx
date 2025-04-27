
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CryptoData } from "@/types/trading";

interface CorrelationAnalysisProps {
  coins: CryptoData[];
  selectedCoins: string[];
  correlations: {
    [key: string]: {
      [key: string]: number;
    };
  };
  onCoinSelect: (coinId: string) => void;
}

export const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({
  coins,
  selectedCoins,
  correlations,
  onCoinSelect,
}) => {
  const getCorrelationDescription = (value: number): string => {
    if (value >= 0.8) return "Strong positive correlation";
    if (value >= 0.5) return "Moderate positive correlation";
    if (value >= 0.2) return "Weak positive correlation";
    if (value >= -0.2) return "No significant correlation";
    if (value >= -0.5) return "Weak negative correlation";
    if (value >= -0.8) return "Moderate negative correlation";
    return "Strong negative correlation";
  };
  
  const getCorrelationColor = (value: number): string => {
    if (value >= 0.8) return "text-green-600";
    if (value >= 0.5) return "text-green-500";
    if (value >= 0.2) return "text-green-400";
    if (value >= -0.2) return "text-gray-500";
    if (value >= -0.5) return "text-red-400";
    if (value >= -0.8) return "text-red-500";
    return "text-red-600";
  };
  
  const selectedCorrelations = selectedCoins.length >= 2 ? (
    <div className="mt-4 space-y-3">
      <h3 className="font-medium">Selected Coin Correlations</h3>
      <div className="space-y-2">
        {selectedCoins.map((coinId1, i) => 
          selectedCoins.slice(i + 1).map((coinId2) => {
            const coin1 = coins.find(c => c.id === coinId1);
            const coin2 = coins.find(c => c.id === coinId2);
            
            if (!coin1 || !coin2 || !correlations[coinId1] || correlations[coinId1][coinId2] === undefined) {
              return null;
            }
            
            const correlation = correlations[coinId1][coinId2];
            
            return (
              <div key={`${coinId1}-${coinId2}`} className="p-3 border rounded-md bg-muted/30">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{coin1.symbol}</span>
                    <span>↔</span>
                    <span className="font-medium">{coin2.symbol}</span>
                  </div>
                  <Badge variant="outline">{correlation.toFixed(2)}</Badge>
                </div>
                <div className={`text-xs mt-1 ${getCorrelationColor(correlation)}`}>
                  {getCorrelationDescription(correlation)}
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <div className="text-sm mt-4">
        <h4 className="font-medium mb-1">Portfolio Implications</h4>
        <p className="text-muted-foreground">
          {selectedCoins.length === 2 && correlations[selectedCoins[0]]?.[selectedCoins[1]] <= -0.2 ? (
            "These assets may offer diversification benefits due to their negative or low correlation."
          ) : selectedCoins.length === 2 && correlations[selectedCoins[0]]?.[selectedCoins[1]] >= 0.8 ? (
            "These assets are highly correlated and may not provide significant diversification benefits."
          ) : (
            "Consider mixing assets with low correlation to improve portfolio diversification."
          )}
        </p>
      </div>
    </div>
  ) : (
    <div className="text-center py-4 text-muted-foreground">
      Select at least 2 coins to analyze correlations
    </div>
  );
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Select Coins to Analyze (up to 3)</h3>
      
      <div className="flex flex-wrap gap-2">
        {coins.map((coin) => (
          <Button
            key={coin.id}
            variant={selectedCoins.includes(coin.id) ? "default" : "outline"}
            size="sm"
            onClick={() => onCoinSelect(coin.id)}
            className="flex items-center gap-2"
          >
            {coin.image && (
              <img 
                src={coin.image} 
                alt={coin.name} 
                className="w-4 h-4 rounded-full" 
              />
            )}
            {coin.symbol}
          </Button>
        ))}
      </div>
      
      {selectedCorrelations}
    </div>
  );
};
