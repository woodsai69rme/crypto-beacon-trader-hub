
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CryptoData } from '@/types/trading';

interface CorrelationAnalysisProps {
  selectedCoin: CryptoData;
  correlationData: number[][];
  coins: CryptoData[];
}

const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({
  selectedCoin,
  correlationData,
  coins
}) => {
  // Find the index of the selected coin
  const selectedIndex = coins.findIndex(coin => coin.id === selectedCoin.id);
  
  if (selectedIndex === -1) return <div>Coin not found in correlation data</div>;
  
  // Get correlation values for the selected coin
  const correlations = correlationData[selectedIndex];
  
  // Create an array of coins with their correlation to the selected coin
  const correlatedCoins = coins.map((coin, index) => ({
    ...coin,
    correlation: correlations[index]
  })).filter(coin => coin.id !== selectedCoin.id);
  
  // Sort by correlation value (descending)
  const sortedCoins = [...correlatedCoins].sort((a, b) => b.correlation - a.correlation);
  
  // Get highest and lowest correlated coins
  const highestCorrelated = sortedCoins.slice(0, 3);
  const lowestCorrelated = sortedCoins.slice(-3).reverse();
  
  // Calculate average correlation
  const avgCorrelation = correlatedCoins.reduce((sum, coin) => sum + coin.correlation, 0) / correlatedCoins.length;
  
  const getCorrelationDescription = (value: number): string => {
    if (value > 0.8) return "Very Strong Positive";
    if (value > 0.6) return "Strong Positive";
    if (value > 0.4) return "Moderate Positive";
    if (value > 0.2) return "Weak Positive";
    if (value > -0.2) return "No Correlation";
    if (value > -0.4) return "Weak Negative";
    if (value > -0.6) return "Moderate Negative";
    if (value > -0.8) return "Strong Negative";
    return "Very Strong Negative";
  };

  const getCorrelationColor = (value: number): string => {
    if (value > 0.6) return "text-green-600";
    if (value > 0.2) return "text-green-400";
    if (value > -0.2) return "text-gray-500";
    if (value > -0.6) return "text-red-400";
    return "text-red-600";
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Correlation Analysis for {selectedCoin.name} ({selectedCoin.symbol})
            </h3>
            <p className="text-sm text-muted-foreground">
              Average correlation: <span className={getCorrelationColor(avgCorrelation)}>
                {avgCorrelation.toFixed(3)} ({getCorrelationDescription(avgCorrelation)})
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Highest Correlations</h4>
              <div className="space-y-2">
                {highestCorrelated.map(coin => (
                  <div key={coin.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      {coin.image && (
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                      )}
                      <span className="font-medium">{coin.symbol}</span>
                      <span className="text-sm text-muted-foreground">{coin.name}</span>
                    </div>
                    <div className="text-right">
                      <Badge className={getCorrelationColor(coin.correlation)}>
                        {coin.correlation.toFixed(3)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Lowest Correlations</h4>
              <div className="space-y-2">
                {lowestCorrelated.map(coin => (
                  <div key={coin.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      {coin.image && (
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                      )}
                      <span className="font-medium">{coin.symbol}</span>
                      <span className="text-sm text-muted-foreground">{coin.name}</span>
                    </div>
                    <div className="text-right">
                      <Badge className={getCorrelationColor(coin.correlation)}>
                        {coin.correlation.toFixed(3)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Understanding Correlations</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• <strong>Positive correlation (0 to 1):</strong> Assets tend to move in the same direction</p>
              <p>• <strong>Negative correlation (-1 to 0):</strong> Assets tend to move in opposite directions</p>
              <p>• <strong>No correlation (around 0):</strong> Assets move independently</p>
              <p>• Values closer to 1 or -1 indicate stronger relationships</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationAnalysis;
