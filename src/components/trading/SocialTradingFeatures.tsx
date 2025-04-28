
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StrategyShare, TradingSignal } from '@/types/trading';
import { toast } from "@/components/ui/use-toast";
import { 
  Search, 
  Users, 
  TrendingUp, 
  ChevronUp, 
  ChevronDown, 
  MessageSquare, 
  Share2, 
  ThumbsUp, 
  Download 
} from "lucide-react";

// Mock data for strategy shares
const mockStrategyShares: StrategyShare[] = [
  {
    id: "1",
    userId: "user1",
    username: "CryptoMaster",
    userAvatar: "https://github.com/shadcn.png",
    strategyName: "BTC Breakout Strategy",
    strategyType: "breakout",
    description: "This strategy detects and trades Bitcoin breakouts with high accuracy.",
    performance: {
      winRate: 0.68,
      profitFactor: 1.85,
      totalTrades: 125,
      averageReturn: 2.4
    },
    tags: ["Bitcoin", "Breakout", "Technical"],
    likes: 45,
    downloads: 23,
    timestamp: "2025-04-25T10:30:00Z"
  },
  {
    id: "2",
    userId: "user2",
    username: "AlgoTrader",
    userAvatar: "https://api.dicebear.com/7.x/bottts/svg",
    strategyName: "ETH-BTC Correlation Arbitrage",
    strategyType: "arbitrage",
    description: "Exploits correlation divergence between ETH and BTC for reliable profits.",
    performance: {
      winRate: 0.72,
      profitFactor: 1.95,
      totalTrades: 98,
      averageReturn: 1.8
    },
    tags: ["Ethereum", "Bitcoin", "Arbitrage", "Correlation"],
    likes: 38,
    downloads: 17,
    timestamp: "2025-04-24T14:15:00Z"
  },
  {
    id: "3",
    userId: "user3",
    username: "TechAnalyst",
    userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=TA",
    strategyName: "Multi-Timeframe SOL Strategy",
    strategyType: "multi-timeframe",
    description: "Combines signals from multiple timeframes for Solana trading.",
    performance: {
      winRate: 0.65,
      profitFactor: 2.1,
      totalTrades: 75,
      averageReturn: 3.2
    },
    tags: ["Solana", "Multi-Timeframe", "Technical"],
    likes: 22,
    downloads: 9,
    timestamp: "2025-04-22T09:45:00Z"
  }
];

// Mock data for trading signals
const mockTradingSignals: TradingSignal[] = [
  {
    id: "1",
    userId: "user1",
    username: "CryptoMaster",
    userAvatar: "https://github.com/shadcn.png",
    coinId: "bitcoin",
    coinSymbol: "BTC",
    type: "buy",
    entryPrice: 59750,
    targetPrice: 65000,
    stopLoss: 57500,
    timeframe: "4h",
    confidence: "high",
    reasoning: "BTC breaking out of a 3-week consolidation with increasing volume.",
    timestamp: "2025-04-28T08:20:00Z",
    likes: 18,
    comments: 3
  },
  {
    id: "2",
    userId: "user2",
    username: "AlgoTrader",
    userAvatar: "https://api.dicebear.com/7.x/bottts/svg",
    coinId: "ethereum",
    coinSymbol: "ETH",
    type: "sell",
    entryPrice: 3050,
    targetPrice: 2850,
    stopLoss: 3150,
    timeframe: "1d",
    confidence: "medium",
    reasoning: "ETH showing bearish divergence on daily RSI with decreasing volume.",
    timestamp: "2025-04-27T16:45:00Z",
    likes: 12,
    comments: 5
  },
  {
    id: "3",
    userId: "user3",
    username: "TechAnalyst",
    userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=TA",
    coinId: "solana",
    coinSymbol: "SOL",
    type: "buy",
    entryPrice: 140.5,
    targetPrice: 155,
    stopLoss: 135,
    timeframe: "1h",
    confidence: "high",
    reasoning: "SOL just completed an inverse head and shoulders pattern.",
    timestamp: "2025-04-28T07:30:00Z",
    likes: 24,
    comments: 7
  }
];

const SocialTradingFeatures: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("signals");
  const [strategyShares, setStrategyShares] = useState<StrategyShare[]>([]);
  const [tradingSignals, setTradingSignals] = useState<TradingSignal[]>([]);
  
  // Initialize with mock data
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setStrategyShares(mockStrategyShares);
      setTradingSignals(mockTradingSignals);
    }, 500);
  }, []);
  
  // Filter trading signals based on search query
  const filteredSignals = tradingSignals.filter(signal => {
    const lowerQuery = searchQuery.toLowerCase();
    return (
      signal.username.toLowerCase().includes(lowerQuery) ||
      signal.coinSymbol.toLowerCase().includes(lowerQuery) ||
      signal.reasoning.toLowerCase().includes(lowerQuery)
    );
  });
  
  // Filter strategy shares based on search query
  const filteredShares = strategyShares.filter(share => {
    const lowerQuery = searchQuery.toLowerCase();
    return (
      share.username.toLowerCase().includes(lowerQuery) ||
      share.strategyName.toLowerCase().includes(lowerQuery) ||
      share.description.toLowerCase().includes(lowerQuery) ||
      share.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  });
  
  const handleLikeSignal = (signalId: string) => {
    setTradingSignals(prevSignals => 
      prevSignals.map(signal => 
        signal.id === signalId 
          ? { ...signal, likes: signal.likes + 1 }
          : signal
      )
    );
    
    toast({
      title: "Signal Liked",
      description: "You've liked this trading signal"
    });
  };
  
  const handleLikeStrategy = (strategyId: string) => {
    setStrategyShares(prevShares => 
      prevShares.map(share => 
        share.id === strategyId 
          ? { ...share, likes: share.likes + 1 }
          : share
      )
    );
    
    toast({
      title: "Strategy Liked",
      description: "You've liked this trading strategy"
    });
  };
  
  const handleDownloadStrategy = (strategyId: string) => {
    setStrategyShares(prevShares => 
      prevShares.map(share => 
        share.id === strategyId 
          ? { ...share, downloads: share.downloads + 1 }
          : share
      )
    );
    
    toast({
      title: "Strategy Downloaded",
      description: "Trading strategy has been added to your library"
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Social Trading
            </CardTitle>
            <CardDescription>
              Connect with traders, share strategies, and follow signals
            </CardDescription>
          </div>
          
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search signals, strategies..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="signals">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trading Signals
            </TabsTrigger>
            <TabsTrigger value="strategies">
              <Share2 className="h-4 w-4 mr-2" />
              Shared Strategies
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="signals" className="space-y-6">
            {filteredSignals.length > 0 ? (
              filteredSignals.map((signal) => (
                <Card key={signal.id} className="overflow-hidden">
                  <div className="flex items-start p-4 gap-4">
                    <Avatar>
                      <AvatarImage src={signal.userAvatar} />
                      <AvatarFallback>{signal.username.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{signal.username}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(signal.timestamp).toLocaleString()}
                          </div>
                        </div>
                        
                        <Badge variant={signal.type === 'buy' ? 'default' : 'destructive'}>
                          {signal.type === 'buy' ? 'BUY' : 'SELL'} {signal.coinSymbol}
                        </Badge>
                      </div>
                      
                      <div className="mt-2">
                        <div className="text-sm">{signal.reasoning}</div>
                        
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-muted rounded p-1.5">
                            <div className="text-muted-foreground">Entry</div>
                            <div className="font-medium">${signal.entryPrice.toLocaleString()}</div>
                          </div>
                          <div className="bg-muted rounded p-1.5">
                            <div className="text-muted-foreground">Target</div>
                            <div className="font-medium">${signal.targetPrice.toLocaleString()}</div>
                          </div>
                          <div className="bg-muted rounded p-1.5">
                            <div className="text-muted-foreground">Stop Loss</div>
                            <div className="font-medium">${signal.stopLoss.toLocaleString()}</div>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center gap-4">
                          <div className="flex items-center text-xs">
                            <Badge variant="outline" className="mr-1">
                              {signal.timeframe}
                            </Badge>
                            <span className="text-muted-foreground">timeframe</span>
                          </div>
                          
                          <Badge variant={
                            signal.confidence === 'high' ? 'default' : 
                            signal.confidence === 'medium' ? 'secondary' : 
                            'outline'
                          }>
                            {signal.confidence} confidence
                          </Badge>
                          
                          <div className="ml-auto flex items-center gap-3">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8" 
                              onClick={() => handleLikeSignal(signal.id)}
                            >
                              <ThumbsUp className="h-4 w-4" />
                              <span className="ml-1 text-xs">{signal.likes}</span>
                            </Button>
                            
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MessageSquare className="h-4 w-4" />
                              <span className="ml-1 text-xs">{signal.comments}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No trading signals found matching your search.
              </div>
            )}
            
            <div className="text-center mt-4">
              <Button variant="outline">
                Load More Signals
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="strategies" className="space-y-6">
            {filteredShares.length > 0 ? (
              filteredShares.map((share) => (
                <Card key={share.id} className="overflow-hidden">
                  <div className="flex items-start p-4 gap-4">
                    <Avatar>
                      <AvatarImage src={share.userAvatar} />
                      <AvatarFallback>{share.username.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{share.username}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(share.timestamp).toLocaleString()}
                          </div>
                        </div>
                        
                        <Badge variant="outline">
                          {share.strategyType}
                        </Badge>
                      </div>
                      
                      <div className="mt-2">
                        <div className="font-medium">{share.strategyName}</div>
                        <div className="text-sm mt-1">{share.description}</div>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          {share.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="bg-muted rounded p-2">
                            <div className="text-muted-foreground">Win Rate</div>
                            <div className="font-medium">{(share.performance.winRate * 100).toFixed(1)}%</div>
                          </div>
                          <div className="bg-muted rounded p-2">
                            <div className="text-muted-foreground">Profit Factor</div>
                            <div className="font-medium">{share.performance.profitFactor.toFixed(2)}</div>
                          </div>
                          <div className="bg-muted rounded p-2">
                            <div className="text-muted-foreground">Total Trades</div>
                            <div className="font-medium">{share.performance.totalTrades}</div>
                          </div>
                          <div className="bg-muted rounded p-2">
                            <div className="text-muted-foreground">Avg Return</div>
                            <div className="font-medium">{share.performance.averageReturn.toFixed(1)}%</div>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center">
                          <div className="ml-auto flex items-center gap-3">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleLikeStrategy(share.id)}
                            >
                              <ThumbsUp className="h-4 w-4" />
                              <span className="ml-1 text-xs">{share.likes}</span>
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleDownloadStrategy(share.id)}
                            >
                              <Download className="h-4 w-4" />
                              <span className="ml-1 text-xs">{share.downloads}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No strategies found matching your search.
              </div>
            )}
            
            <div className="text-center mt-4">
              <Button variant="outline">
                Load More Strategies
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SocialTradingFeatures;
