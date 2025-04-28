
import React from "react";
import { Button } from "@/components/ui/button";
import { CryptoData } from "@/types/trading";
import { getCorrelationDescription } from "./utils";

interface CorrelationAnalysisProps {
  coins: CryptoData[];
  correlations: Record<string, Record<string, number>>;
  selectedCoins: string[];
  onSelectCoin: (coinId: string) => void;
}

const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({
  coins,
  correlations,
  selectedCoins,
  onSelectCoin
}) => {
  return (
    <div>
      <h3 className="font-medium mb-2">Selected Assets</h3>
      <div className="flex flex-wrap gap-2">
        {coins.map((coin) => (
          <Button
            key={coin.id}
            variant={selectedCoins.includes(coin.id) ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectCoin(coin.id)}
          >
            {coin.symbol}
          </Button>
        ))}
      </div>
      
      {selectedCoins.length > 0 ? (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Correlation Analysis</h3>
          <div className="space-y-2">
            {selectedCoins.map((coin1Id) => {
              const coin1 = coins.find(c => c.id === coin1Id);
              if (!coin1) return null;
              
              return (
                <div key={`analysis-${coin1Id}`} className="p-3 border rounded-md">
                  <h4 className="font-medium">{coin1.name} ({coin1.symbol})</h4>
                  <div className="mt-2 space-y-1">
                    {selectedCoins
                      .filter(id => id !== coin1Id)
                      .map((coin2Id) => {
                        const coin2 = coins.find(c => c.id === coin2Id);
                        if (!coin2) return null;
                        
                        const correlation = correlations[coin1Id]?.[coin2Id] || 0;
                        
                        return (
                          <div key={`pair-${coin1Id}-${coin2Id}`} className="flex justify-between text-sm">
                            <span>vs {coin2.name} ({coin2.symbol}): </span>
                            <span className={correlation > 0 ? "text-green-500" : "text-red-500"}>
                              {correlation.toFixed(2)} - {getCorrelationDescription(correlation)}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                  
                  <div className="mt-3 text-sm text-muted-foreground">
                    <strong>Insight:</strong> {' '}
                    {correlations[coin1Id] && Object.values(correlations[coin1Id]).some(val => val < -0.5) 
                      ? `${coin1.name} shows strong negative correlation with some assets, making it good for portfolio diversification.` 
                      : `${coin1.name} shows mostly positive correlations, suggesting similar price movements to other assets.`
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground mt-4">
          <p>Select up to 3 assets to see detailed correlation analysis.</p>
        </div>
      )}
    </div>
  );
};

export default CorrelationAnalysis;
