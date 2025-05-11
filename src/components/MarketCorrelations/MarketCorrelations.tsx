
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CryptoData } from '@/types/trading';
import { mockCorrelationData, generateHistoricalPrices, generateCorrelationMatrix } from './mockData';
import CorrelationMatrix from './CorrelationMatrix';
import CorrelationHeatmap from './CorrelationHeatmap';
import PriceCorrelationChart from './PriceCorrelationChart';
import CorrelationAnalysis from './CorrelationAnalysis';

const MarketCorrelations: React.FC = () => {
  const [cryptoData] = useState<CryptoData[]>(mockCorrelationData);
  const [selectedCoinId, setSelectedCoinId] = useState<string>('bitcoin');
  const [comparedCoinId, setComparedCoinId] = useState<string>('ethereum');
  const [historicalPrices, setHistoricalPrices] = useState<Record<string, number[]>>({});
  const [correlationMatrix, setCorrelationMatrix] = useState<Record<string, Record<string, number>>>({});
  const [activeTab, setActiveTab] = useState<string>('analysis');
  
  useEffect(() => {
    const histPrices = generateHistoricalPrices(cryptoData, 30);
    setHistoricalPrices(histPrices);
    
    const corrMatrix = generateCorrelationMatrix(histPrices);
    setCorrelationMatrix(corrMatrix);
  }, [cryptoData]);
  
  const handleSelectPair = (coin1: string, coin2: string) => {
    setSelectedCoinId(coin1);
    setComparedCoinId(coin2);
    setActiveTab('chart');
  };
  
  const selectedCoin = cryptoData.find(c => c.id === selectedCoinId);
  const comparedCoin = cryptoData.find(c => c.id === comparedCoinId);
  const correlation = correlationMatrix[selectedCoinId]?.[comparedCoinId] || 0;
  
  if (!selectedCoin || !comparedCoin) {
    return <div>Loading correlation data...</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Market Correlations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-4 md:space-y-0">
            <TabsList>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="matrix">Matrix</TabsTrigger>
              <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
              <TabsTrigger value="chart">Chart</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-row space-x-2">
              <Select value={selectedCoinId} onValueChange={setSelectedCoinId}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Asset" />
                </SelectTrigger>
                <SelectContent>
                  {cryptoData.map(coin => (
                    <SelectItem key={coin.id} value={coin.id}>
                      {coin.symbol.toUpperCase()} - {coin.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {activeTab === 'chart' && (
                <Select value={comparedCoinId} onValueChange={setComparedCoinId}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Compare with" />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptoData
                      .filter(coin => coin.id !== selectedCoinId)
                      .map(coin => (
                        <SelectItem key={coin.id} value={coin.id}>
                          {coin.symbol.toUpperCase()} - {coin.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          
          <TabsContent value="analysis">
            <CorrelationAnalysis 
              correlationMatrix={correlationMatrix} 
              cryptoData={cryptoData} 
              selectedCoinId={selectedCoinId}
              onSelectPair={handleSelectPair}
            />
          </TabsContent>
          
          <TabsContent value="matrix">
            <CorrelationMatrix 
              correlationMatrix={correlationMatrix} 
              cryptoData={cryptoData}
              onSelectCell={handleSelectPair}
            />
          </TabsContent>
          
          <TabsContent value="heatmap">
            <CorrelationHeatmap 
              correlationMatrix={correlationMatrix} 
              cryptoData={cryptoData}
              onSelectPair={handleSelectPair}
            />
          </TabsContent>
          
          <TabsContent value="chart">
            <PriceCorrelationChart 
              coin1={selectedCoin} 
              coin2={comparedCoin} 
              historicalPrices={historicalPrices} 
              correlation={correlation}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketCorrelations;
