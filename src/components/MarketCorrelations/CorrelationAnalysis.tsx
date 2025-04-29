
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CryptoData } from "@/types/trading";
import { Badge } from "@/components/ui/badge";
import { 
  formatCorrelation,
  getCorrelationDescription,
  getCorrelationInterpretation
} from "./utils";

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
  // Get pairs of selected coins for detailed analysis
  const getPairs = () => {
    const pairs = [];
    
    for (let i = 0; i < selectedCoins.length; i++) {
      for (let j = i + 1; j < selectedCoins.length; j++) {
        const coinId1 = selectedCoins[i];
        const coinId2 = selectedCoins[j];
        
        const coin1 = coins.find(c => c.id === coinId1);
        const coin2 = coins.find(c => c.id === coinId2);
        
        if (coin1 && coin2) {
          const correlation = correlations[coinId1]?.[coinId2] || 0;
          
          pairs.push({
            coin1,
            coin2,
            correlation
          });
        }
      }
    }
    
    return pairs;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-3">Select Coins for Analysis</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Select up to 3 coins to analyze their correlations in detail
          </p>
          
          <div className="flex flex-wrap gap-2">
            {coins.map(coin => (
              <Badge
                key={coin.id}
                variant={selectedCoins.includes(coin.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onSelectCoin(coin.id)}
              >
                {coin.symbol.toUpperCase()}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {selectedCoins.length > 1 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-3">Correlation Analysis</h3>
            
            <div className="space-y-6">
              {getPairs().map(({ coin1, coin2, correlation }) => (
                <div key={`${coin1.id}-${coin2.id}`} className="border-b pb-4">
                  <h4 className="font-medium mb-2">
                    {coin1.symbol.toUpperCase()} and {coin2.symbol.toUpperCase()}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Correlation:</span>
                        <span className="text-sm font-medium">{formatCorrelation(correlation)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Relationship:</span>
                        <span className="text-sm font-medium">{getCorrelationDescription(correlation)}</span>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 rounded-md p-2">
                      <span className="text-xs font-medium">Price Movement</span>
                      <div className="w-full bg-muted h-2 mt-1 mb-1">
                        <div 
                          className="h-2 bg-primary" 
                          style={{ width: `${(Math.abs(correlation) * 100).toFixed(0)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Independent</span>
                        <span>Correlated</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm">
                    {getCorrelationInterpretation(correlation, coin1.symbol.toUpperCase(), coin2.symbol.toUpperCase())}
                  </p>
                </div>
              ))}
            </div>
            
            {selectedCoins.length < 2 && (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Select at least 2 coins to see correlation analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CorrelationAnalysis;
