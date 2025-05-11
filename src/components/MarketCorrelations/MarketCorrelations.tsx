
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CorrelationMatrix from './CorrelationMatrix';
import { PriceCorrelationChart } from './PriceCorrelationChart';
import CorrelationAnalysis from './CorrelationAnalysis';
import { mockCryptoData, generateHistoricalPrices, generateCorrelationMatrix } from './mockData';
import { CryptoData } from '@/types/trading';

const MarketCorrelations: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState<CryptoData>(mockCryptoData[0]);
  const [historicalPrices, setHistoricalPrices] = useState<Record<string, number[]>>({});
  const [correlationMatrix, setCorrelationMatrix] = useState<Record<string, Record<string, number>>>({});
  
  useEffect(() => {
    // Generate mock historical prices and correlation matrix
    const prices = generateHistoricalPrices(mockCryptoData);
    setHistoricalPrices(prices);
    
    const matrix = generateCorrelationMatrix(prices);
    setCorrelationMatrix(matrix);
  }, []);
  
  const handleCoinSelect = (coin: CryptoData) => {
    setSelectedCoin(coin);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Market Correlations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="matrix">
            <TabsList className="mb-4">
              <TabsTrigger value="matrix">Correlation Matrix</TabsTrigger>
              <TabsTrigger value="chart">Price Correlation</TabsTrigger>
              <TabsTrigger value="analysis">Correlation Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="matrix">
              <CorrelationMatrix 
                correlationMatrix={correlationMatrix}
                coins={mockCryptoData}
                onCoinSelect={handleCoinSelect}
              />
            </TabsContent>
            
            <TabsContent value="chart">
              <PriceCorrelationChart 
                historicalPrices={historicalPrices}
                selectedCoin={selectedCoin}
                coins={mockCryptoData}
                onCoinSelect={handleCoinSelect}
              />
            </TabsContent>
            
            <TabsContent value="analysis">
              <CorrelationAnalysis 
                initialCoinId={selectedCoin.id}
                timeframe="7d"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketCorrelations;
