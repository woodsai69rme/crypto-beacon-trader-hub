
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { CryptoData, CoinOption } from "@/types/trading";
import { fetchTopCoins } from "@/services/cryptoApi";
import CorrelationHeatmap from "./CorrelationHeatmap";
import CorrelationAnalysis from "./CorrelationAnalysis";
import CorrelationExplainer from "./CorrelationExplainer";
import { generateMockCorrelations } from "./utils";

type TimeRange = '7d' | '30d' | '90d';

const MarketCorrelations = () => {
  const [coins, setCoins] = useState<CryptoData[]>([]);
  const [correlations, setCorrelations] = useState<Record<string, Record<string, number>>>({});
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  
  useEffect(() => {
    fetchCoinsAndCorrelations();
  }, [timeRange]);
  
  const fetchCoinsAndCorrelations = async () => {
    setIsLoading(true);
    try {
      // Fetch and convert CoinOption[] to CryptoData[]
      const coinsData = await fetchTopCoins(10);
      
      // Properly map CoinOption to CryptoData structure
      const cryptoData: CryptoData[] = coinsData.map((coin: CoinOption) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        // Map to both naming conventions to ensure compatibility
        price: coin.price,
        current_price: coin.price,
        priceChange: coin.priceChange,
        price_change_24h: coin.priceChange || 0,
        changePercent: coin.changePercent,
        price_change_percentage_24h: coin.changePercent || 0,
        marketCap: coin.marketCap,
        market_cap: coin.marketCap || 0,
        market_cap_rank: coin.marketCap ? Math.floor(coin.marketCap / 1000000000) : undefined,
        volume: coin.volume,
        volume_24h: coin.volume || 0,
        total_volume: coin.volume,
        circulating_supply: 0, // Required field, provide a default
        rank: coin.marketCap ? Math.floor(coin.marketCap / 1000000000) : undefined
      }));
      
      setCoins(cryptoData);
      
      // Generate mock correlation data for the demo
      const mockCorrelations = generateMockCorrelations(cryptoData, timeRange);
      setCorrelations(mockCorrelations);
    } catch (error) {
      console.error("Failed to fetch correlation data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch correlation data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleCoinSelection = (coinId: string) => {
    if (selectedCoins.includes(coinId)) {
      setSelectedCoins(selectedCoins.filter(id => id !== coinId));
    } else {
      if (selectedCoins.length < 3) {
        setSelectedCoins([...selectedCoins, coinId]);
      } else {
        toast({
          title: "Selection limit reached",
          description: "You can select up to 3 coins for detailed analysis",
        });
      }
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Market Correlations</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={timeRange === '7d' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setTimeRange('7d')}
            >
              7D
            </Button>
            <Button 
              variant={timeRange === '30d' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setTimeRange('30d')}
            >
              30D
            </Button>
            <Button 
              variant={timeRange === '90d' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setTimeRange('90d')}
            >
              90D
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="matrix" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="matrix">Correlation Matrix</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="matrix">
            <CorrelationHeatmap 
              coins={coins} 
              correlations={correlations}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="analysis">
            <div className="space-y-4">
              <CorrelationAnalysis
                coins={coins}
                correlations={correlations}
                selectedCoins={selectedCoins}
                onSelectCoin={toggleCoinSelection}
              />
              
              <CorrelationExplainer />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketCorrelations;
