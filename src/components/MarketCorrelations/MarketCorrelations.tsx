
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/utils/formatters";
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
      const cryptoData = coinsData.map(coin => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image || "",
        current_price: coin.price || coin.current_price || 0,
        market_cap: coin.marketCap || coin.market_cap || 0,
        market_cap_rank: coin.rank || coin.market_cap_rank || 0,
        fully_diluted_valuation: null,
        total_volume: coin.volume || 0,
        high_24h: null,
        low_24h: null,
        price_change_24h: coin.priceChange || 0,
        price_change_percentage_24h: coin.changePercent || coin.price_change_percentage_24h || 0,
        market_cap_change_24h: 0,
        market_cap_change_percentage_24h: 0,
        circulating_supply: 0,
        total_supply: null,
        max_supply: null,
        ath: null,
        ath_change_percentage: null,
        ath_date: null,
        atl: null,
        atl_change_percentage: null,
        atl_date: null,
        roi: null,
        last_updated: new Date().toISOString()
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
