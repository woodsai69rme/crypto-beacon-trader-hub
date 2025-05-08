
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Maximize2, Minimize2, RefreshCw, Bookmark, BookmarkPlus } from "lucide-react";
import { CoinOption } from '../trading/types';
import { LiveAnalyticsDashboardProps } from "@/types/trading";
import LivePriceMetrics from './LivePriceMetrics';
import LiveMarketDepth from './LiveMarketDepth';
import LiveTradingSignals from './LiveTradingSignals';
import LiveActivityFeed from './LiveActivityFeed';
import LiveTechnicalIndicators from './LiveTechnicalIndicators';

const LiveAnalyticsDashboard: React.FC<LiveAnalyticsDashboardProps> = ({
  initialCoinId = "bitcoin",
  refreshInterval = 15000,
  showDetailedView = false,
  onAlertTriggered,
  darkMode
}) => {
  const [selectedCoinId, setSelectedCoinId] = useState<string>(initialCoinId);
  const [isDetached, setIsDetached] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [watchlist, setWatchlist] = useState<string[]>(["bitcoin", "ethereum", "solana"]);

  // Sample coin options for the dashboard
  const coinOptions: CoinOption[] = [
    { 
      id: "bitcoin", 
      name: "Bitcoin", 
      symbol: "BTC", 
      price: 61245.32, 
      priceChange: 1245.32, 
      changePercent: 2.18, 
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      volume: 48941516789,
      marketCap: 1143349097968,
      value: "bitcoin",
      label: "Bitcoin (BTC)"
    },
    { 
      id: "ethereum", 
      name: "Ethereum", 
      symbol: "ETH", 
      price: 3105.78, 
      priceChange: 65.43, 
      changePercent: 2.15, 
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      volume: 21891456789,
      marketCap: 373952067386,
      value: "ethereum",
      label: "Ethereum (ETH)"
    },
    { 
      id: "solana", 
      name: "Solana", 
      symbol: "SOL", 
      price: 152.37, 
      priceChange: 5.23, 
      changePercent: 3.55, 
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      volume: 3578912345,
      marketCap: 67891234567,
      value: "solana",
      label: "Solana (SOL)"
    }
  ];

  // Simulate data refresh
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshData();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  const refreshData = () => {
    setIsRefreshing(true);
    // Simulate API call delay
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 500);
  };

  const toggleDetachMode = () => {
    setIsDetached(!isDetached);
  };

  const toggleInWatchlist = () => {
    if (watchlist.includes(selectedCoinId)) {
      setWatchlist(watchlist.filter(id => id !== selectedCoinId));
    } else {
      setWatchlist([...watchlist, selectedCoinId]);
    }
  };

  const selectedCoin = coinOptions.find(coin => coin.id === selectedCoinId) || coinOptions[0];

  const dashboardContent = (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Select value={selectedCoinId} onValueChange={setSelectedCoinId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select asset" />
            </SelectTrigger>
            <SelectContent>
              {coinOptions.map(coin => (
                <SelectItem key={coin.id} value={coin.id} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <img 
                      src={coin.image} 
                      alt={coin.symbol} 
                      className="h-4 w-4 rounded-full" 
                    />
                    {coin.name} ({coin.symbol})
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={toggleInWatchlist}
          >
            {watchlist.includes(selectedCoinId) ? (
              <Bookmark className="h-4 w-4" />
            ) : (
              <BookmarkPlus className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleDetachMode}
            className="h-8 w-8"
          >
            {isDetached ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <LivePriceMetrics 
        coin={selectedCoin} 
        lastUpdated={lastUpdated} 
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="indicators">Indicators</TabsTrigger>
          <TabsTrigger value="orderbook">Order Book</TabsTrigger>
          <TabsTrigger value="signals">Signals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LiveMarketDepth coinId={selectedCoinId} symbol={selectedCoin.symbol} />
            <LiveActivityFeed coinId={selectedCoinId} />
          </div>
        </TabsContent>
        
        <TabsContent value="indicators" className="mt-4">
          <LiveTechnicalIndicators coinId={selectedCoinId} />
        </TabsContent>
        
        <TabsContent value="orderbook" className="mt-4">
          <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
            <p className="text-muted-foreground">Order book visualization will appear here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="signals" className="mt-4">
          <LiveTradingSignals coinId={selectedCoinId} />
        </TabsContent>
      </Tabs>
    </div>
  );

  // If detached, render in a dialog
  if (isDetached) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Analytics</CardTitle>
          <CardDescription>
            Dashboard is currently in detached mode
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={toggleDetachMode}>
            Return to Embedded View
          </Button>
          
          <Dialog open={isDetached} onOpenChange={setIsDetached} modal={false}>
            <DialogContent className="max-w-5xl h-[90vh] p-4 overflow-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <CardTitle>Live Analytics Dashboard</CardTitle>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={toggleDetachMode}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </div>
                {dashboardContent}
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  // Default embedded view
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Live Analytics Dashboard</CardTitle>
            <CardDescription>
              Real-time market data and signals
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {dashboardContent}
      </CardContent>
    </Card>
  );
};

export default LiveAnalyticsDashboard;
