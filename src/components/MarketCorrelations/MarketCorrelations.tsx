
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { CryptoData } from "@/services/cryptoApi";
import { fetchTopCoins } from "@/services/cryptoApi";
import { CorrelationHeatmap } from "./CorrelationHeatmap";
import { CorrelationAnalysis } from "./CorrelationAnalysis";
import { CorrelationExplainer } from "./CorrelationExplainer";
import { generateMockCorrelations } from "./mockData";

type TimeRange = '7d' | '30d' | '90d';

interface Correlation {
  [key: string]: {
    [key: string]: number;
  };
}

const MarketCorrelations = () => {
  const [coins, setCoins] = useState<CryptoData[]>([]);
  const [correlations, setCorrelations] = useState<Correlation>({});
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  
  const availableCoins = coins.slice(0, 10);
  
  useEffect(() => {
    fetchCoinsAndCorrelations();
  }, [timeRange]);
  
  const fetchCoinsAndCorrelations = async () => {
    setIsLoading(true);
    try {
      const coinsData = await fetchTopCoins(10) as unknown as CryptoData[];
      setCoins(coinsData);
      
      // Generate correlation data
      const correlationData = generateMockCorrelations(coinsData, timeRange);
      setCorrelations(correlationData);
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
    <Card className="shadow-md crypto-card">
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
          
          <TabsContent value="matrix" className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <CorrelationHeatmap coins={availableCoins} correlations={correlations} />
            )}
          </TabsContent>
          
          <TabsContent value="analysis">
            <div className="space-y-4">
              <CorrelationAnalysis 
                coins={availableCoins}
                selectedCoins={selectedCoins}
                correlations={correlations}
                onCoinSelect={toggleCoinSelection}
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
