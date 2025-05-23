
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CryptoData } from '@/types/trading';

export interface CorrelationAnalysisProps {
  selectedCoin: CryptoData;
  correlationMatrix: Record<string, Record<string, number>>;
  coins: CryptoData[];
  onCoinSelect: (coin: CryptoData) => void;
}

const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({
  selectedCoin,
  correlationMatrix,
  coins,
  onCoinSelect
}) => {
  // Find highly correlated and uncorrelated assets to the selected coin
  const correlations = correlationMatrix[selectedCoin.id] || {};
  
  const correlatedAssets = Object.entries(correlations)
    .filter(([coinId]) => coinId !== selectedCoin.id)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
    
  const uncorrelatedAssets = Object.entries(correlations)
    .filter(([coinId]) => coinId !== selectedCoin.id)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3);
    
  // Helper function to get coin details by ID
  const getCoinById = (id: string) => coins.find(coin => coin.id === id) || null;
  
  // Helper function to format correlation values
  const formatCorrelation = (value: number) => {
    return (value * 100).toFixed(1) + '%';
  };
  
  // Helper function to get correlation description
  const getCorrelationDescription = (value: number) => {
    if (value > 0.8) return 'Very Strong Positive';
    if (value > 0.6) return 'Strong Positive';
    if (value > 0.4) return 'Moderate Positive';
    if (value > 0.2) return 'Weak Positive';
    if (value > -0.2) return 'Very Weak / No Correlation';
    if (value > -0.4) return 'Weak Negative';
    if (value > -0.6) return 'Moderate Negative';
    if (value > -0.8) return 'Strong Negative';
    return 'Very Strong Negative';
  };
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Correlation Analysis: {selectedCoin.name}</h3>
            <p className="text-sm text-gray-500 mb-4">
              Understand how {selectedCoin.name} price movements correlate with other assets.
              Higher correlation (closer to 100%) means assets tend to move together, while
              lower correlation suggests independent movement.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-2">Most Correlated Assets</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {correlatedAssets.map(([coinId, correlation]) => {
                const coin = getCoinById(coinId);
                if (!coin) return null;
                
                return (
                  <div 
                    key={coinId}
                    className="border rounded-lg p-3 cursor-pointer hover:bg-slate-50"
                    onClick={() => onCoinSelect(coin)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{coin.name}</span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        correlation > 0.6 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {formatCorrelation(correlation)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">{getCorrelationDescription(correlation)}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-2">Least Correlated Assets</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {uncorrelatedAssets.map(([coinId, correlation]) => {
                const coin = getCoinById(coinId);
                if (!coin) return null;
                
                return (
                  <div 
                    key={coinId}
                    className="border rounded-lg p-3 cursor-pointer hover:bg-slate-50"
                    onClick={() => onCoinSelect(coin)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{coin.name}</span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        correlation < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {formatCorrelation(correlation)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">{getCorrelationDescription(correlation)}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2">What This Means</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Diversification potential:</strong> Assets with low correlation to {selectedCoin.name} may
                provide better diversification benefits in your portfolio.
              </p>
              <p>
                <strong>Risk management:</strong> During market volatility, uncorrelated assets may help
                reduce overall portfolio risk.
              </p>
              <p>
                <strong>Trading opportunities:</strong> Pairs with strong correlations might present 
                opportunities for pairs trading strategies.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationAnalysis;
