
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ThumbsUp, Users, TrendingUp, Check, Lock } from "lucide-react";
import { StrategyShare, TradingSignal } from '@/types/trading';

// Mock data for trading signals
const mockSignals: TradingSignal[] = [
  {
    id: "signal-1",
    userId: "user1",
    username: "CryptoTrader",
    userAvatar: "https://i.pravatar.cc/48?u=1",
    coin: "Bitcoin",
    symbol: "BTC",
    direction: "buy",
    price: 62340.50,
    targetPrice: 65000,
    stopLoss: 61000,
    timeframe: "4h",
    confidence: 85,
    reasoning: "Strong support at $61K with bullish divergence on RSI",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    likes: 24,
    status: "active"
  },
  {
    id: "signal-2",
    userId: "user2",
    username: "ETH_Whale",
    userAvatar: "https://i.pravatar.cc/48?u=2",
    coin: "Ethereum",
    symbol: "ETH",
    direction: "sell",
    price: 3120.75,
    targetPrice: 2900,
    stopLoss: 3200,
    timeframe: "1d",
    confidence: 72,
    reasoning: "Double top formation at $3200 with bearish MACD crossover",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    expiresAt: new Date(Date.now() + 172800000).toISOString(),
    likes: 18,
    status: "active"
  },
  {
    id: "signal-3",
    userId: "user3",
    username: "AlgoTrader",
    coin: "Solana",
    symbol: "SOL",
    direction: "buy",
    price: 143.25,
    targetPrice: 160,
    stopLoss: 135,
    timeframe: "1h",
    confidence: 68,
    reasoning: "Breaking out of ascending triangle with increased volume",
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    expiresAt: new Date(Date.now() + 43200000).toISOString(),
    likes: 12,
    status: "active"
  }
];

// Mock data for strategy sharing
const mockStrategies: StrategyShare[] = [
  {
    id: "strat-1",
    strategyId: "strategy-bull-momentum",
    strategyName: "Bull Market Momentum Strategy",
    userId: "user1",
    username: "CryptoTrader",
    userAvatar: "https://i.pravatar.cc/48?u=1",
    description: "A momentum strategy designed specifically for bull markets using RSI and MACD for entry/exit",
    performance: {
      winRate: 68,
      profitFactor: 2.1,
      netProfit: 24.5,
      trades: 87,
      sharpeRatio: 1.8
    },
    timeframe: "4h",
    tags: ["momentum", "bull-market", "oscillators"],
    likes: 32,
    createdAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    isVerified: true
  },
  {
    id: "strat-2",
    strategyId: "strategy-vwap-bounce",
    strategyName: "VWAP Bounce Strategy",
    userId: "user4",
    username: "TechnicalTrader",
    userAvatar: "https://i.pravatar.cc/48?u=4",
    description: "Trade bounces off VWAP during trending markets with volume confirmation",
    performance: {
      winRate: 62,
      profitFactor: 1.8,
      netProfit: 18.7,
      trades: 124,
      sharpeRatio: 1.6
    },
    timeframe: "1h",
    tags: ["vwap", "volume", "bounce", "intraday"],
    likes: 28,
    createdAt: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
    isVerified: false
  },
  {
    id: "strat-3",
    strategyId: "strategy-breakout-volatility",
    strategyName: "Volatility Breakout",
    userId: "user5",
    username: "VolTrader",
    userAvatar: "https://i.pravatar.cc/48?u=5",
    description: "Capitalizes on high volatility breakouts with tight stop losses",
    performance: {
      winRate: 55,
      profitFactor: 2.4,
      netProfit: 32.1,
      trades: 76,
      sharpeRatio: 1.9
    },
    timeframe: "15m",
    tags: ["volatility", "breakout", "short-term"],
    likes: 22,
    createdAt: new Date(Date.now() - 2592000000).toISOString(), // 1 month ago
    isVerified: true
  }
];

const SocialTradingFeatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState('signals');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Social Trading
        </CardTitle>
        <CardDescription>
          Discover trading signals and strategies shared by the community
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="signals">Signals</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signals" className="space-y-6">
            {mockSignals.map((signal) => (
              <Card key={signal.id} className="overflow-hidden">
                <div className="border-l-4 border-r-0 border-t-0 border-b-0 border-solid border-primary p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {signal.userAvatar ? (
                        <img 
                          src={signal.userAvatar} 
                          alt={signal.username} 
                          className="w-8 h-8 rounded-full mr-2"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
                          {signal.username.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">{signal.username}</span>
                        <div className="text-xs text-muted-foreground">
                          {new Date(signal.createdAt).toLocaleDateString()} • {signal.timeframe} chart
                        </div>
                      </div>
                    </div>
                    
                    <Badge 
                      variant={signal.status === "active" ? "outline" : "secondary"}
                      className={`${
                        signal.status === "active" ? "bg-green-500/10 text-green-500 border-green-200" :
                        signal.status === "fulfilled" ? "bg-blue-500/10 text-blue-500 border-blue-200" :
                        signal.status === "failed" ? "bg-red-500/10 text-red-500 border-red-200" :
                        "bg-amber-500/10 text-amber-500 border-amber-200"
                      }`}
                    >
                      {signal.status.charAt(0).toUpperCase() + signal.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-muted/50 rounded-md p-3 mb-3">
                    <div className="flex items-center">
                      <span className={`font-bold text-lg ${signal.direction === "buy" ? "text-green-500" : "text-red-500"}`}>
                        {signal.direction.toUpperCase()}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="font-medium">{signal.coin}</span>
                      <span className="text-sm text-muted-foreground ml-1">({signal.symbol})</span>
                    </div>
                    
                    <div className="mt-2 md:mt-0 flex items-center">
                      <div className="text-sm">
                        <div className="font-medium">${signal.price.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Entry Price</div>
                      </div>
                      <div className="h-8 border-l border-border mx-3"></div>
                      <div className="text-sm">
                        <div className="font-medium text-green-500">${signal.targetPrice.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Target</div>
                      </div>
                      <div className="h-8 border-l border-border mx-3"></div>
                      <div className="text-sm">
                        <div className="font-medium text-red-500">${signal.stopLoss.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Stop Loss</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Signal Reasoning:</div>
                      <p className="text-sm">{signal.reasoning}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge className="mr-2">
                          {signal.confidence}% Confidence
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          Expires in {
                            Math.floor((new Date(signal.expiresAt).getTime() - Date.now()) / 3600000)
                          } hours
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {signal.likes}
                        </Button>
                        <Button variant="outline" size="sm">
                          Follow
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            <div className="flex justify-center">
              <Button variant="outline">Load More Signals</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="strategies" className="space-y-6">
            {mockStrategies.map((strategy) => (
              <Card key={strategy.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {strategy.userAvatar ? (
                        <img 
                          src={strategy.userAvatar} 
                          alt={strategy.username} 
                          className="w-8 h-8 rounded-full mr-2"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
                          {strategy.username.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{strategy.username}</span>
                          {strategy.isVerified && (
                            <Check className="h-3 w-3 text-primary ml-1" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Shared {new Date(strategy.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <Badge variant="outline">
                      {strategy.timeframe} Timeframe
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">{strategy.strategyName}</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      {strategy.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2 bg-muted/50 rounded-md p-3 mb-3">
                    <div className="text-center">
                      <div className="text-sm font-medium">{strategy.performance.winRate}%</div>
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{strategy.performance.profitFactor}</div>
                      <div className="text-xs text-muted-foreground">Profit Factor</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">+{strategy.performance.netProfit}%</div>
                      <div className="text-xs text-muted-foreground">Net Profit</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{strategy.performance.sharpeRatio}</div>
                      <div className="text-xs text-muted-foreground">Sharpe</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{strategy.performance.trades}</div>
                      <div className="text-xs text-muted-foreground">Trades</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {strategy.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center">
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {strategy.likes}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Lock className="h-3 w-3 mr-1" />
                        Copy Strategy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-center">
              <Button variant="outline">Discover More Strategies</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SocialTradingFeatures;

function useState(arg0: string): [any, any] {
  return React.useState(arg0);
}
