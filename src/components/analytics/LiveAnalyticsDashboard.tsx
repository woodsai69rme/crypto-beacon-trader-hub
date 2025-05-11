
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Maximize2, BarChart2, RefreshCw } from 'lucide-react';
import { LiveAnalyticsDashboardProps, CoinOption, ApiUsageStats } from '@/types/trading';
import LivePriceMetrics from './LivePriceMetrics';
import ApiUsageMetrics from '../api/ApiUsageMetrics';
import RealTimeApiUsage from '../api/RealTimeApiUsage';
import MarketCorrelations from '../MarketCorrelations/MarketCorrelations';
import DetachedAiTradingDashboard from '../trading/DetachedAiTradingDashboard';
import { mockCryptoData } from '../MarketCorrelations/mockData';

const LiveAnalyticsDashboard: React.FC<LiveAnalyticsDashboardProps> = ({
  initialCoinId = "bitcoin",
  refreshInterval = 15000,
  showDetailedView = false,
  onAlertTriggered,
  darkMode
}) => {
  const [isDetached, setIsDetached] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("prices");
  const [selectedCoinId, setSelectedCoinId] = useState<string>(initialCoinId);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [apiUsageStats, setApiUsageStats] = useState<ApiUsageStats[]>([
    {
      service: "CoinGecko",
      currentUsage: 421,
      maxUsage: 500,
      endpoint: "/coins/markets",
      resetTime: "1 hour"
    },
    {
      service: "CryptoCompare",
      currentUsage: 8750,
      maxUsage: 10000,
      endpoint: "/data/pricemultifull",
      resetTime: "24 hours"
    },
    {
      service: "NewsAPI",
      currentUsage: 89,
      maxUsage: 100,
      endpoint: "/v2/everything",
      resetTime: "12 hours"
    }
  ]);
  
  // Find the selected coin from mock data
  const selectedCoin: CoinOption = mockCryptoData.find(
    coin => coin.id === selectedCoinId
  ) as unknown as CoinOption || {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    price: 61245.32,
    priceChange: 1245.32,
    changePercent: 2.3,
    volume: 28000000000,
    marketCap: 1180000000000,
    value: "bitcoin",
    label: "Bitcoin"
  };

  // Effect for periodic data refreshing
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshData();
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval]);
  
  // Function to refresh all data
  const refreshData = () => {
    // In a real application, this would fetch fresh data from APIs
    setLastUpdated(new Date());
    
    // Simulate API usage changes
    setApiUsageStats(prev => prev.map(stat => ({
      ...stat,
      currentUsage: Math.min(stat.maxUsage, stat.currentUsage + Math.floor(Math.random() * 10))
    })));
  };
  
  // Handle coin selection change
  const handleCoinChange = (coinId: string) => {
    setSelectedCoinId(coinId);
  };

  // Dashboard content
  const dashboardContent = (
    <div className="space-y-6">
      {/* Controls row */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="prices">Price Metrics</TabsTrigger>
            <TabsTrigger value="api">API Usage</TabsTrigger>
            <TabsTrigger value="correlations">Correlations</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <Select value={selectedCoinId} onValueChange={handleCoinChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select coin" />
            </SelectTrigger>
            <SelectContent>
              {mockCryptoData.map(coin => (
                <SelectItem key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol.toUpperCase()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={refreshData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Content based on active tab */}
      <TabsContent value="prices" className="m-0">
        <LivePriceMetrics 
          coin={selectedCoin as CoinOption}
          lastUpdated={lastUpdated}
        />
      </TabsContent>
      
      <TabsContent value="api" className="m-0 space-y-6">
        <ApiUsageMetrics 
          data={apiUsageStats}
          onRefresh={refreshData}
        />
        
        {showDetailedView && (
          <RealTimeApiUsage />
        )}
      </TabsContent>
      
      <TabsContent value="correlations" className="m-0">
        <MarketCorrelations />
      </TabsContent>
      
      <div className="text-xs text-muted-foreground text-right">
        Last updated: {lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Live Analytics Dashboard
              </CardTitle>
              <CardDescription>
                Real-time market metrics and API usage monitoring
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={() => setIsDetached(true)}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {dashboardContent}
        </CardContent>
        
        <CardFooter className="text-sm text-muted-foreground">
          <div className="flex justify-between w-full items-center">
            <div>
              {apiUsageStats.some(stat => stat.currentUsage / stat.maxUsage > 0.9) && (
                <span className="text-red-500 font-medium">⚠️ API rate limit warning</span>
              )}
            </div>
            <Button variant="link" size="sm" className="p-0" onClick={() => setIsDetached(true)}>
              Open in detached mode
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <DetachedAiTradingDashboard
        isDetached={isDetached}
        onClose={() => setIsDetached(false)}
      >
        {dashboardContent}
      </DetachedAiTradingDashboard>
    </>
  );
};

export default LiveAnalyticsDashboard;
