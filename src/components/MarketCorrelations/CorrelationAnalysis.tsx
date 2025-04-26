
import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { CryptoData } from '@/services/cryptoApi';
import { getCorrelationDescription } from './utils';

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
  onCoinSelect
}) => {
  const availableCoins = coins.slice(0, 10);
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Selected Assets</h3>
        <div className="flex flex-wrap gap-2">
          {availableCoins.map((coin) => (
            <Button
              key={coin.id}
              variant={selectedCoins.includes(coin.id) ? "default" : "outline"}
              size="sm"
              onClick={() => onCoinSelect(coin.id)}
            >
              {coin.symbol}
            </Button>
          ))}
        </div>
      </div>
      
      {selectedCoins.length > 0 ? (
        <div>
          <h3 className="font-medium mb-2">Correlation Analysis</h3>
          <div className="space-y-2">
            {selectedCoins.map((coin1Id) => {
              const coin1 = availableCoins.find(c => c.id === coin1Id);
              if (!coin1) return null;
              
              return (
                <div key={`analysis-${coin1Id}`} className="p-3 border rounded-md bg-card">
                  <h4 className="font-medium">{coin1.name} ({coin1.symbol})</h4>
                  <div className="mt-2 space-y-1">
                    {selectedCoins
                      .filter(id => id !== coin1Id)
                      .map((coin2Id) => {
                        const coin2 = availableCoins.find(c => c.id === coin2Id);
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
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>Select up to 3 assets to see detailed correlation analysis.</p>
        </div>
      )}
    </div>
  );
};
