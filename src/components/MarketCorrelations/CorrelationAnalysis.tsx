
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CryptoData } from '@/types/trading';
import { findStrongestCorrelations, getCorrelationColor } from './utils';

interface CorrelationAnalysisProps {
  correlationMatrix: Record<string, Record<string, number>>;
  selectedCoin: CryptoData;
  coins: CryptoData[];
  onCoinSelect: (coin: CryptoData) => void;
}

// Updated to match the CryptoData interface
const mapToCryptoData = (data: any): CryptoData => {
  return {
    id: data.id,
    name: data.name,
    symbol: data.symbol,
    price: data.price || 0,
    priceChange: data.priceChange || 0,
    image: data.image,
    marketCap: data.marketCap,
    volume: data.volume,
    changePercent: data.changePercent
  };
};

export const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({
  correlationMatrix,
  selectedCoin,
  coins,
  onCoinSelect
}) => {
  if (Object.keys(correlationMatrix).length === 0) {
    return <div className="text-center py-4">Loading correlation data...</div>;
  }
  
  const strongestCorrelations = findStrongestCorrelations(
    correlationMatrix,
    selectedCoin.id,
    coins,
    5
  );
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">
          Correlation Analysis for {selectedCoin.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          Examining the strongest price correlations with {selectedCoin.symbol.toUpperCase()}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium mb-4">Strongest Correlations</h4>
            
            {strongestCorrelations.length > 0 ? (
              <div className="space-y-3">
                {strongestCorrelations.map(({ coin, correlation }) => (
                  <div 
                    key={coin.id} 
                    className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/20 cursor-pointer"
                    onClick={() => onCoinSelect(coin)}
                  >
                    <div className="flex items-center">
                      <div className="mr-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: getCorrelationColor(correlation) }}
                        ></div>
                      </div>
                      <div>
                        <p className="font-medium">{coin.name}</p>
                        <p className="text-xs text-muted-foreground">{coin.symbol.toUpperCase()}</p>
                      </div>
                    </div>
                    <div 
                      className={`font-bold text-lg ${
                        correlation > 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {correlation.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No correlation data available</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium mb-4">Correlation Insights</h4>
            
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-medium">Positive correlations</span> indicate that assets tend to move in the same direction.
              </p>
              <p>
                <span className="font-medium">Negative correlations</span> indicate that assets tend to move in opposite directions.
              </p>
              <p>
                Assets with low correlation to {selectedCoin.symbol.toUpperCase()} may provide diversification benefits.
              </p>
              
              <div className="mt-6">
                <p className="font-medium">Trading Implications:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Consider pair trading strategies between highly correlated assets</li>
                  <li>Diversify portfolio with assets showing low correlation</li>
                  <li>Watch for correlation breakdowns as potential trading signals</li>
                </ul>
              </div>
            </div>
            
            <Button className="w-full mt-4" variant="outline" size="sm">
              Generate Detailed Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
