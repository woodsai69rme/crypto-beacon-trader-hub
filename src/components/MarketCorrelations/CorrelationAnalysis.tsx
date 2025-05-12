
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { mockCryptoData, generateCorrelationMatrix, generateHistoricalPrices } from './mockData';
import { findStrongestCorrelations } from './utils';
import CorrelationExplainer from './CorrelationExplainer';
import { CryptoData } from '@/types/trading';

interface CorrelationAnalysisProps {
  initialCoinId: string;
  timeframe: string;
}

const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({ 
  initialCoinId,
  timeframe
}) => {
  const [selectedCoinId, setSelectedCoinId] = useState(initialCoinId);
  const [correlationMatrix, setCorrelationMatrix] = useState<Record<string, Record<string, number>>>({});
  const [strongCorrelations, setStrongCorrelations] = useState<{ coin: CryptoData, correlation: number }[]>([]);
  const [negativeCorrelations, setNegativeCorrelations] = useState<{ coin: CryptoData, correlation: number }[]>([]);
  
  useEffect(() => {
    // Generate historical prices and correlation matrix for demonstration
    const prices = generateHistoricalPrices(mockCryptoData);
    const matrix = generateCorrelationMatrix(prices);
    setCorrelationMatrix(matrix);
    
    // Find strongest correlations
    updateCorrelations(selectedCoinId, matrix);
  }, [selectedCoinId]);
  
  const updateCorrelations = (coinId: string, matrix: Record<string, Record<string, number>>) => {
    const allCorrelations = findStrongestCorrelations(matrix, coinId, mockCryptoData, 10);
    
    // Split into positive and negative correlations
    const positive = allCorrelations.filter(item => item.correlation > 0)
      .sort((a, b) => b.correlation - a.correlation)
      .slice(0, 5);
    
    const negative = allCorrelations.filter(item => item.correlation < 0)
      .sort((a, b) => a.correlation - b.correlation)
      .slice(0, 5);
    
    setStrongCorrelations(positive);
    setNegativeCorrelations(negative);
  };
  
  const handleCoinChange = (coinId: string) => {
    setSelectedCoinId(coinId);
  };
  
  const formatCorrelation = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Correlation Analysis</h3>
        <div className="text-sm text-muted-foreground mb-4">
          Analyze how {mockCryptoData.find(c => c.id === selectedCoinId)?.name} correlates with other assets
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {mockCryptoData.map(coin => (
            <Button
              key={coin.id}
              variant={coin.id === selectedCoinId ? "default" : "outline"}
              size="sm"
              onClick={() => handleCoinChange(coin.id)}
            >
              {coin.symbol.toUpperCase()}
            </Button>
          ))}
        </div>
        
        <Tabs defaultValue="positive" className="mt-6">
          <TabsList>
            <TabsTrigger value="positive">Positive Correlations</TabsTrigger>
            <TabsTrigger value="negative">Negative Correlations</TabsTrigger>
            <TabsTrigger value="about">About Correlation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="positive">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Assets that move with {mockCryptoData.find(c => c.id === selectedCoinId)?.symbol.toUpperCase()}</h4>
                  <div className="space-y-2">
                    {strongCorrelations.length > 0 ? (
                      strongCorrelations.map(item => (
                        <div key={item.coin.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="font-medium">{item.coin.name}</div>
                          <div className={`text-sm ${item.correlation > 0.7 ? 'text-green-600 font-bold' : 'text-green-500'}`}>
                            {formatCorrelation(item.correlation)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-4">No strong positive correlations found</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="negative">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Assets that move against {mockCryptoData.find(c => c.id === selectedCoinId)?.symbol.toUpperCase()}</h4>
                  <div className="space-y-2">
                    {negativeCorrelations.length > 0 ? (
                      negativeCorrelations.map(item => (
                        <div key={item.coin.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="font-medium">{item.coin.name}</div>
                          <div className={`text-sm ${item.correlation < -0.7 ? 'text-red-600 font-bold' : 'text-red-500'}`}>
                            {formatCorrelation(item.correlation)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-4">No strong negative correlations found</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="about">
            <Card>
              <CardContent className="pt-6">
                <CorrelationExplainer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CorrelationAnalysis;
