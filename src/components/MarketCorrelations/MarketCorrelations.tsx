
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CorrelationHeatmap from './CorrelationHeatmap';
import CorrelationAnalysis from './CorrelationAnalysis';
import CorrelationExplainer from './CorrelationExplainer';
import { CryptoData, CoinOption } from '@/types/trading';
import { mockCoins } from './mockData';
import { Skeleton } from '@/components/ui/skeleton';
import { getTrendingCoins } from '@/services/enhancedCryptoApi';

const MarketCorrelations: React.FC = () => {
  const [activeTab, setActiveTab] = useState('heatmap');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<CryptoData[]>([]);
  const [selectedCoins, setSelectedCoins] = useState<string[]>(['bitcoin', 'ethereum', 'binancecoin', 'solana', 'cardano']);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch real data from API
        // const response = await fetch('https://api.example.com/crypto/correlations');
        // const data = await response.json();
        
        // For demo, using mock data and converting to expected format
        const topCoins = await getTrendingCoins();
        
        const formattedData: CryptoData[] = topCoins.map(coin => ({
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          image: coin.image || '',
          price: coin.price,
          current_price: coin.price,
          priceChange: coin.priceChange || 0,
          price_change_24h: coin.priceChange || 0,
          changePercent: coin.priceChange || 0,
          price_change_percentage_24h: coin.priceChange || 0,
          market_cap: coin.price * 19000000,
          market_cap_rank: topCoins.findIndex(c => c.id === coin.id) + 1,
          volume_24h: coin.price * 5000000,
          total_volume: coin.price * 5000000,
          circulating_supply: 19000000,
          rank: topCoins.findIndex(c => c.id === coin.id) + 1
        }));
        
        setData(formattedData);
      } catch (error) {
        console.error('Error loading correlation data:', error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const toggleCoin = (coinId: string) => {
    setSelectedCoins(prev => 
      prev.includes(coinId) 
        ? prev.filter(id => id !== coinId) 
        : [...prev, coinId]
    );
  };

  const filteredData = data.filter(coin => selectedCoins.includes(coin.id));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Market Correlations</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="explainer">Explainer</TabsTrigger>
              </TabsList>
            </div>
            
            {isLoading ? (
              <div className="space-y-4 py-4">
                <Skeleton className="h-[400px] w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ) : (
              <>
                <TabsContent value="heatmap">
                  <CorrelationHeatmap data={filteredData} />
                </TabsContent>
                
                <TabsContent value="analysis">
                  <CorrelationAnalysis data={filteredData} />
                </TabsContent>
                
                <TabsContent value="explainer">
                  <CorrelationExplainer />
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketCorrelations;
