
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Maximize2, Minimize2, RefreshCw, Clock, BarChart2, LineChart, PieChart, TrendingUp, TrendingDown } from "lucide-react";
import { CoinOption } from "@/types/trading";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for demonstration
const mockCryptoData: CoinOption[] = [
  { 
    id: "bitcoin", 
    name: "Bitcoin", 
    symbol: "BTC", 
    price: 63245.32,
    priceChange: 1200,
    changePercent: 2.3,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    volume: 28000000000,
    marketCap: 1180000000000,
    value: "BTC",
    label: "Bitcoin (BTC)" 
  },
  { 
    id: "ethereum", 
    name: "Ethereum", 
    symbol: "ETH", 
    price: 3110.45,
    priceChange: -120,
    changePercent: -1.5,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    volume: 15000000000,
    marketCap: 360000000000,
    value: "ETH",
    label: "Ethereum (ETH)"
  },
  { 
    id: "solana", 
    name: "Solana", 
    symbol: "SOL", 
    price: 118.33,
    priceChange: 3.56,
    changePercent: 3.1,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    volume: 5200000000,
    marketCap: 90000000000,
    value: "SOL",
    label: "Solana (SOL)"
  }
];

interface LiveMetric {
  id: string;
  name: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  unit?: string;
  category: 'price' | 'volume' | 'sentiment' | 'technical' | 'social';
}

const mockMarketMetrics: LiveMetric[] = [
  { id: 'total-market-cap', name: 'Total Market Cap', value: '2.45T', change: 1.2, trend: 'up', category: 'price' },
  { id: 'btc-dominance', name: 'BTC Dominance', value: '42.5%', change: -0.3, trend: 'down', category: 'price' },
  { id: 'eth-gas', name: 'ETH Gas', value: '25 Gwei', change: 0, trend: 'neutral', category: 'price' },
  { id: 'fear-greed', name: 'Fear & Greed', value: '72', change: 5, trend: 'up', unit: 'Greed', category: 'sentiment' },
  { id: 'total-volume', name: '24h Volume', value: '123.5B', change: 3.2, trend: 'up', category: 'volume' },
  { id: 'social-mentions', name: 'Social Mentions', value: '245K', change: 12.3, trend: 'up', category: 'social' },
  { id: 'btc-funding-rate', name: 'BTC Funding Rate', value: '0.01%', change: -0.002, trend: 'down', category: 'technical' },
  { id: 'eth-funding-rate', name: 'ETH Funding Rate', value: '0.02%', change: 0.005, trend: 'up', category: 'technical' },
];

interface PriceAlert {
  id: string;
  asset: string;
  condition: 'above' | 'below';
  price: number;
  triggered: boolean;
  createdAt: string;
}

const mockPriceAlerts: PriceAlert[] = [
  { id: 'alert-1', asset: 'BTC', condition: 'above', price: 65000, triggered: false, createdAt: '2023-04-10T12:00:00Z' },
  { id: 'alert-2', asset: 'ETH', condition: 'below', price: 3000, triggered: true, createdAt: '2023-04-09T09:30:00Z' },
  { id: 'alert-3', asset: 'SOL', condition: 'above', price: 120, triggered: false, createdAt: '2023-04-08T15:45:00Z' },
];

// Mock chart data
const generateChartData = () => {
  const data = [];
  let date = new Date();
  
  for (let i = 0; i < 24; i++) {
    date = new Date(date.getTime() - 60 * 60 * 1000);
    data.push({
      time: date.toISOString(),
      value: 50000 + Math.random() * 5000
    });
  }
  
  return data.reverse();
};

interface LiveAnalyticsDashboardProps {
  initialCoinId?: string;
  refreshInterval?: number;
}

const LiveAnalyticsDashboard: React.FC<LiveAnalyticsDashboardProps> = ({ 
  initialCoinId = 'bitcoin',
  refreshInterval = 15000
}) => {
  const [isDetached, setIsDetached] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(initialCoinId);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [activeMetricFilter, setActiveMetricFilter] = useState<string>('all');
  const isMobile = useIsMobile();
  
  const selectedCoinData = mockCryptoData.find(coin => coin.id === selectedCoin) || mockCryptoData[0];
  const filteredMetrics = activeMetricFilter === 'all' 
    ? mockMarketMetrics 
    : mockMarketMetrics.filter(metric => metric.category === activeMetricFilter);
  
  // Auto-refresh effect
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 1000);
  };
  
  const toggleDetached = () => {
    setIsDetached(!isDetached);
  };
  
  // Render the detached dashboard in a dialog
  if (isDetached) {
    return (
      <Dialog open={isDetached} onOpenChange={setIsDetached} modal={false}>
        <DialogContent className="max-w-5xl h-[90vh] p-0">
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between w-full">
              <DialogTitle>Live Analytics Dashboard</DialogTitle>
              <Button variant="ghost" size="icon" onClick={toggleDetached}>
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="p-4 space-y-6 overflow-y-auto" style={{ height: 'calc(90vh - 60px)' }}>
            <LiveAnalyticsContent 
              selectedCoinData={selectedCoinData}
              selectedCoin={selectedCoin}
              setSelectedCoin={setSelectedCoin}
              refreshing={refreshing}
              handleRefresh={handleRefresh}
              lastUpdated={lastUpdated}
              filteredMetrics={filteredMetrics}
              activeMetricFilter={activeMetricFilter}
              setActiveMetricFilter={setActiveMetricFilter}
              isMobile={isMobile}
              isDetached={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Live Analytics</CardTitle>
          <CardDescription>Real-time market metrics and analytics</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="outline" size="sm" onClick={toggleDetached}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <LiveAnalyticsContent 
          selectedCoinData={selectedCoinData}
          selectedCoin={selectedCoin}
          setSelectedCoin={setSelectedCoin}
          refreshing={refreshing}
          handleRefresh={handleRefresh}
          lastUpdated={lastUpdated}
          filteredMetrics={filteredMetrics}
          activeMetricFilter={activeMetricFilter}
          setActiveMetricFilter={setActiveMetricFilter}
          isMobile={isMobile}
          isDetached={false}
        />
      </CardContent>
    </Card>
  );
};

interface LiveAnalyticsContentProps {
  selectedCoinData: CoinOption;
  selectedCoin: string;
  setSelectedCoin: (coinId: string) => void;
  refreshing: boolean;
  handleRefresh: () => void;
  lastUpdated: Date;
  filteredMetrics: LiveMetric[];
  activeMetricFilter: string;
  setActiveMetricFilter: (filter: string) => void;
  isMobile: boolean;
  isDetached: boolean;
}

const LiveAnalyticsContent: React.FC<LiveAnalyticsContentProps> = ({
  selectedCoinData,
  selectedCoin,
  setSelectedCoin,
  lastUpdated,
  filteredMetrics,
  activeMetricFilter,
  setActiveMetricFilter,
  isMobile,
  isDetached
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Select value={selectedCoin} onValueChange={setSelectedCoin}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select coin" />
            </SelectTrigger>
            <SelectContent>
              {mockCryptoData.map(coin => (
                <SelectItem key={coin.id} value={coin.id}>
                  <div className="flex items-center">
                    <img 
                      src={coin.image} 
                      alt={coin.name} 
                      className="w-5 h-5 mr-2 rounded-full" 
                    />
                    {coin.name} ({coin.symbol})
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-xs text-muted-foreground flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base flex items-center gap-2">
              <img 
                src={selectedCoinData.image} 
                alt={selectedCoinData.name} 
                className="w-5 h-5 rounded-full" 
              />
              {selectedCoinData.name} Price
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                ${selectedCoinData.price.toLocaleString()}
              </div>
              <div className={`flex items-center ${
                selectedCoinData.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {selectedCoinData.changePercent >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {selectedCoinData.changePercent.toFixed(2)}%
              </div>
            </div>
            
            <div className="mt-4 h-40 bg-muted/30 rounded-md flex items-center justify-center">
              <BarChart2 className="h-10 w-10 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-base">Market Metrics</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="space-y-1 mb-3">
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={activeMetricFilter === 'all' ? 'default' : 'outline'} 
                  className="cursor-pointer"
                  onClick={() => setActiveMetricFilter('all')}
                >
                  All
                </Badge>
                <Badge 
                  variant={activeMetricFilter === 'price' ? 'default' : 'outline'} 
                  className="cursor-pointer"
                  onClick={() => setActiveMetricFilter('price')}
                >
                  Price
                </Badge>
                <Badge 
                  variant={activeMetricFilter === 'volume' ? 'default' : 'outline'} 
                  className="cursor-pointer"
                  onClick={() => setActiveMetricFilter('volume')}
                >
                  Volume
                </Badge>
                <Badge 
                  variant={activeMetricFilter === 'sentiment' ? 'default' : 'outline'} 
                  className="cursor-pointer"
                  onClick={() => setActiveMetricFilter('sentiment')}
                >
                  Sentiment
                </Badge>
                <Badge 
                  variant={activeMetricFilter === 'technical' ? 'default' : 'outline'} 
                  className="cursor-pointer"
                  onClick={() => setActiveMetricFilter('technical')}
                >
                  Technical
                </Badge>
              </div>
            </div>
            
            <div className={`space-y-2 ${isDetached ? 'max-h-40 overflow-y-auto pr-2' : ''}`}>
              {filteredMetrics.map((metric) => (
                <div key={metric.id} className="flex items-center justify-between py-1 border-b border-muted last:border-0">
                  <div className="text-sm font-medium">{metric.name}</div>
                  <div className="flex items-center">
                    <span className="font-mono mr-2">{metric.value}</span>
                    <span className={`text-xs ${
                      metric.trend === 'up' ? 'text-green-500' : 
                      metric.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
                    }`}>
                      {metric.trend === 'up' && '+'}
                      {metric.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {isDetached && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Volume Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="h-60 bg-muted/30 rounded-md flex items-center justify-center">
                <BarChart2 className="h-10 w-10 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Price Correlation</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="h-60 bg-muted/30 rounded-md flex items-center justify-center">
                <LineChart className="h-10 w-10 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Market Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="h-60 bg-muted/30 rounded-md flex items-center justify-center">
                <PieChart className="h-10 w-10 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Tabs defaultValue="alerts">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
          <TabsTrigger value="signals">Trading Signals</TabsTrigger>
          <TabsTrigger value="news">Market News</TabsTrigger>
          <TabsTrigger value="social">Social Sentiment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="alerts" className="m-0">
          <div className="space-y-2">
            {mockPriceAlerts.map(alert => (
              <div 
                key={alert.id} 
                className={`p-3 border rounded-md flex items-center justify-between ${
                  alert.triggered ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900' : ''
                }`}
              >
                <div>
                  <div className="font-medium">
                    {alert.asset} {alert.condition === 'above' ? '>' : '<'} ${alert.price.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created {new Date(alert.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  {alert.triggered ? (
                    <Badge variant="destructive">Triggered</Badge>
                  ) : (
                    <Badge variant="outline">Active</Badge>
                  )}
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full mt-2">
              Add New Alert
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="signals" className="m-0">
          <div className="flex items-center justify-center p-8 border rounded-md">
            <p className="text-muted-foreground">Trading signals will appear here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="news" className="m-0">
          <div className="flex items-center justify-center p-8 border rounded-md">
            <p className="text-muted-foreground">Market news will appear here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="social" className="m-0">
          <div className="flex items-center justify-center p-8 border rounded-md">
            <p className="text-muted-foreground">Social sentiment data will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default LiveAnalyticsDashboard;
