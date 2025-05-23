
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
  
  const getCorrelationBadgeColor = (value: number): string => {
    if (value > 0.6) return "bg-green-500";
    if (value > 0.2) return "bg-green-300";
    if (value > -0.2) return "bg-gray-400";
    if (value > -0.6) return "bg-red-300";
    return "bg-red-500";
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-2">Correlation Analysis: {selectedCoin.name} ({selectedCoin.symbol})</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Understanding how {selectedCoin.symbol} moves in relation to other major cryptocurrencies 
              can help with portfolio diversification and risk management.
            </p>
            
            <div className="bg-card border border-border rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Average Correlation</p>
                  <p className="text-xl font-bold">{avgCorrelation.toFixed(2)}</p>
                  <Badge variant="outline" className="mt-1">
                    {getCorrelationDescription(avgCorrelation)}
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Highest Correlation</p>
                  <p className="text-xl font-bold">{highestCorrelated[0]?.correlation.toFixed(2) || "N/A"}</p>
                  <Badge variant="outline" className="mt-1">
                    {highestCorrelated[0]?.symbol || "N/A"}
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Lowest Correlation</p>
                  <p className="text-xl font-bold">{lowestCorrelated[0]?.correlation.toFixed(2) || "N/A"}</p>
                  <Badge variant="outline" className="mt-1">
                    {lowestCorrelated[0]?.symbol || "N/A"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-semibold mb-3">Highest Correlated Assets</h4>
              <div className="space-y-3">
                {highestCorrelated.map(coin => (
                  <div key={coin.id} className="flex items-center justify-between border-b border-border pb-2">
                    <div className="flex items-center">
                      {coin.image && (
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                      )}
                      <span>{coin.name} ({coin.symbol})</span>
                    </div>
                    <Badge className={getCorrelationBadgeColor(coin.correlation)}>
                      {coin.correlation.toFixed(2)}
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                These assets tend to move in the same direction as {selectedCoin.symbol}.
                Consider this when diversifying your portfolio.
              </p>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-3">Lowest Correlated Assets</h4>
              <div className="space-y-3">
                {lowestCorrelated.map(coin => (
                  <div key={coin.id} className="flex items-center justify-between border-b border-border pb-2">
                    <div className="flex items-center">
                      {coin.image && (
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                      )}
                      <span>{coin.name} ({coin.symbol})</span>
                    </div>
                    <Badge className={getCorrelationBadgeColor(coin.correlation)}>
                      {coin.correlation.toFixed(2)}
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                These assets have the least correlation with {selectedCoin.symbol}.
                They may provide better diversification benefits.
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-2">Trading Implications</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Strong positive correlations suggest similar market movements</li>
              <li>Low correlations can help with portfolio diversification</li>
              <li>Negative correlations may provide hedging opportunities</li>
              <li>Correlations can change over time, particularly during market stress</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationAnalysis;
