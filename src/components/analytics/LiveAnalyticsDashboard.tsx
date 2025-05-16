
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { fetchTopCryptoData } from "@/services/enhancedCryptoApi";
import { LiveAnalyticsDashboardProps, CoinOption, ApiUsageStats } from '@/types/trading';
import ApiUsageMetrics from "@/components/api/ApiUsageMetrics";

const LiveAnalyticsDashboard: React.FC<LiveAnalyticsDashboardProps> = ({
  refreshInterval = 60000,
  initialCoinId = 'bitcoin',
  showDetailedView = false,
  darkMode = false
}) => {
  const [activeTab, setActiveTab] = useState('price');
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock API usage stats
  const apiUsageStats: ApiUsageStats[] = [
    {
      totalRequests: 5243,
      successfulRequests: 5220,
      failedRequests: 23,
      lastRequest: new Date().toISOString(),
      rateLimit: 10000,
      rateLimitRemaining: 4757,
      rateLimitReset: Date.now() + 86400000,
      service: "CoinGecko",
      currentUsage: 5243,
      maxUsage: 10000,
      endpoint: "coins/markets",
      resetTime: new Date(Date.now() + 86400000).toISOString()
    },
    {
      totalRequests: 7234,
      successfulRequests: 7200,
      failedRequests: 34,
      lastRequest: new Date().toISOString(),
      rateLimit: 20000,
      rateLimitRemaining: 12766,
      rateLimitReset: Date.now() + 86400000,
      service: "Binance",
      currentUsage: 7234,
      maxUsage: 20000,
      endpoint: "ticker/24hr",
      resetTime: new Date(Date.now() + 86400000).toISOString()
    },
    {
      totalRequests: 1923,
      successfulRequests: 1920,
      failedRequests: 3,
      lastRequest: new Date().toISOString(),
      rateLimit: 5000,
      rateLimitRemaining: 3077,
      rateLimitReset: Date.now() + 86400000,
      service: "Kraken",
      currentUsage: 1923,
      maxUsage: 5000,
      endpoint: "public/Ticker",
      resetTime: new Date(Date.now() + 86400000).toISOString()
    }
  ];
  
  const [coins, setCoins] = useState<CoinOption[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const cryptoData = await fetchTopCryptoData(10);
        
        // Transform crypto data into coin options
        const coinOptions: CoinOption[] = cryptoData.map(coin => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          price: coin.current_price || 0,
          priceChange: coin.priceChangePercentage24h || 0,
          changePercent: coin.priceChangePercentage24h || 0,
          marketCap: coin.marketCap || 0,
          volume: coin.totalVolume || 0,
          value: coin.id,
          label: `${coin.name} (${coin.symbol})`
        }));
        
        setCoins(coinOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchData, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [refreshInterval]);
  
  const handleRefreshApiMetrics = () => {
    console.log("Refreshing API metrics...");
    // In a real app, this would fetch fresh API usage data
  };
  
  return (
    <div className="space-y-4">
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>Live Analytics Dashboard</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="price" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="price">Price Data</TabsTrigger>
              <TabsTrigger value="volume">Volume Analysis</TabsTrigger>
              <TabsTrigger value="api">API Usage</TabsTrigger>
            </TabsList>
            
            <TabsContent value="price">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Live price analysis and charts would appear here.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="volume">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Volume analysis and liquidity metrics would appear here.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="api">
              <ApiUsageMetrics 
                data={apiUsageStats}
                onRefresh={handleRefreshApiMetrics}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveAnalyticsDashboard;
