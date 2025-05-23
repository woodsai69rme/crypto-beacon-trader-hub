
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CorrelationMatrix from './CorrelationMatrix';
import CorrelationHeatmap from './CorrelationHeatmap';
import CorrelationAnalysis from './CorrelationAnalysis';
import PriceCorrelationChart from './PriceCorrelationChart';
import CorrelationExplainer from './CorrelationExplainer';
import { mockCorrelationData, mockHistoricalPrices } from './mockData';
import { CryptoData } from '@/types/trading';

const MarketCorrelations = () => {
  const [activeTab, setActiveTab] = useState('matrix');
  const [selectedCoin, setSelectedCoin] = useState<CryptoData>(mockCorrelationData.coins[0]);
  const [timeframe, setTimeframe] = useState('30d');
  
  const handleCoinSelect = (coin: CryptoData) => {
    setSelectedCoin(coin);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Market Correlations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={selectedCoin.id}
                onValueChange={(value) => {
                  const coin = mockCorrelationData.coins.find(c => c.id === value);
                  if (coin) handleCoinSelect(coin);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select coin" />
                </SelectTrigger>
                <SelectContent>
                  {mockCorrelationData.coins.map(coin => (
                    <SelectItem key={coin.id} value={coin.id}>
                      {coin.name} ({coin.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" size="sm">
              Export Data
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="matrix">Correlation Matrix</TabsTrigger>
              <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
              <TabsTrigger value="chart">Price Comparison</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="matrix">
              <CorrelationMatrix 
                correlationData={mockCorrelationData.correlationMatrix} 
                coins={mockCorrelationData.coins} 
              />
              <CorrelationExplainer />
            </TabsContent>
            
            <TabsContent value="heatmap">
              <CorrelationHeatmap 
                correlationData={mockCorrelationData.correlationMatrix} 
                coins={mockCorrelationData.coins}
                onCoinSelect={handleCoinSelect}
              />
              <CorrelationExplainer />
            </TabsContent>
            
            <TabsContent value="chart">
              <PriceCorrelationChart 
                historicalPrices={mockHistoricalPrices}
                selectedCoin={selectedCoin}
                coins={mockCorrelationData.coins}
                onCoinSelect={handleCoinSelect}
              />
            </TabsContent>
            
            <TabsContent value="analysis">
              <CorrelationAnalysis 
                selectedCoin={selectedCoin}
                correlationData={mockCorrelationData.correlationMatrix}
                coins={mockCorrelationData.coins}
              />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketCorrelations;
