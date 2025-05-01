
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share, ThumbsUp, User, Users, Check, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface StrategyShare {
  id: string;
  strategyId: string;
  strategyName: string;
  userId: string;
  username: string;
  userAvatar?: string;
  description: string;
  performance: {
    winRate: number;
    profitFactor: number;
    netProfit: number;
    trades: number;
    sharpeRatio: number;
  };
  timeframe: string;
  tags: string[];
  likes: number;
  createdAt: string;
  isVerified: boolean;
}

interface TradingSignal {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  coin: string;
  symbol: string;
  direction: 'buy' | 'sell';
  price: number;
  targetPrice: number;
  stopLoss: number;
  timeframe: string;
  confidence: number;
  reasoning: string;
  createdAt: string;
  expiresAt: string;
  likes: number;
  status: 'active' | 'fulfilled' | 'failed' | 'expired';
}

interface SocialTradingFeaturesProps {
  className?: string;
}

const SocialTradingFeatures: React.FC<SocialTradingFeaturesProps> = ({ className }) => {
  const [strategies, setStrategies] = useState<StrategyShare[]>([
    {
      id: "strat1",
      strategyId: "strategy-1",
      strategyName: "Trend Momentum Pro",
      userId: "user1",
      username: "cryptotrader",
      userAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=cryptotrader",
      description: "A proven trend following strategy that uses momentum indicators to find optimal entry points",
      performance: {
        winRate: 68,
        profitFactor: 2.3,
        netProfit: 15400,
        trades: 187,
        sharpeRatio: 1.8
      },
      timeframe: "4h",
      tags: ["trend", "momentum", "macd", "ema"],
      likes: 348,
      createdAt: "2023-11-15T09:23:15Z",
      isVerified: true
    },
    {
      id: "strat2",
      strategyId: "strategy-2",
      strategyName: "Breakout Scanner",
      userId: "user2",
      username: "algotrader",
      userAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=algotrader",
      description: "Identifies and trades volatility breakouts from consolidation patterns",
      performance: {
        winRate: 62,
        profitFactor: 1.9,
        netProfit: 9800,
        trades: 143,
        sharpeRatio: 1.6
      },
      timeframe: "1h",
      tags: ["breakout", "volatility", "bollinger", "atr"],
      likes: 217,
      createdAt: "2023-12-04T14:37:22Z",
      isVerified: false
    },
    {
      id: "strat3",
      strategyId: "strategy-3",
      strategyName: "Sentiment AI Alpha",
      userId: "user3",
      username: "tradingAI",
      userAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=tradingAI",
      description: "Uses AI sentiment analysis from social media and news to predict market moves",
      performance: {
        winRate: 71,
        profitFactor: 2.7,
        netProfit: 22600,
        trades: 98,
        sharpeRatio: 2.2
      },
      timeframe: "1d",
      tags: ["ai", "sentiment", "social", "news"],
      likes: 492,
      createdAt: "2023-10-22T11:15:43Z",
      isVerified: true
    }
  ]);
  
  const [signals, setSignals] = useState<TradingSignal[]>([
    {
      id: "signal1",
      userId: "user1",
      username: "cryptotrader",
      userAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=cryptotrader",
      coin: "Bitcoin",
      symbol: "BTC",
      direction: "buy",
      price: 61250,
      targetPrice: 65000,
      stopLoss: 59800,
      timeframe: "4h",
      confidence: 85,
      reasoning: "Strong bullish divergence on 4h RSI with increasing volume and support at the 200 EMA",
      createdAt: "2023-04-15T08:22:15Z",
      expiresAt: "2023-04-18T08:22:15Z",
      likes: 124,
      status: "active"
    },
    {
      id: "signal2",
      userId: "user2",
      username: "algotrader",
      userAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=algotrader",
      coin: "Ethereum",
      symbol: "ETH",
      direction: "sell",
      price: 3020,
      targetPrice: 2850,
      stopLoss: 3120,
      timeframe: "1d",
      confidence: 72,
      reasoning: "Double top pattern formed on daily chart with bearish MACD crossover and declining volume",
      createdAt: "2023-04-14T16:45:32Z",
      expiresAt: "2023-04-21T16:45:32Z",
      likes: 87,
      status: "active"
    },
    {
      id: "signal3",
      userId: "user3",
      username: "tradingAI",
      userAvatar: "https://api.dicebear.com/7.x/personas/svg?seed=tradingAI",
      coin: "Solana",
      symbol: "SOL",
      direction: "buy",
      price: 121.5,
      targetPrice: 135,
      stopLoss: 115,
      timeframe: "12h",
      confidence: 92,
      reasoning: "AI sentiment analysis detected a significant positive shift in social media mentions with institutional buying patterns",
      createdAt: "2023-04-16T09:12:45Z",
      expiresAt: "2023-04-20T09:12:45Z",
      likes: 194,
      status: "active"
    }
  ]);
  
  const handleLikeStrategy = (id: string) => {
    setStrategies(strategies.map(strategy => {
      if (strategy.id === id) {
        return {
          ...strategy,
          likes: strategy.likes + 1
        };
      }
      return strategy;
    }));
    
    toast({
      title: "Strategy Liked",
      description: "This strategy has been added to your favorites",
    });
  };
  
  const handleLikeSignal = (id: string) => {
    setSignals(signals.map(signal => {
      if (signal.id === id) {
        return {
          ...signal,
          likes: signal.likes + 1
        };
      }
      return signal;
    }));
    
    toast({
      title: "Signal Liked",
      description: "This signal has been added to your watchlist",
    });
  };
  
  const handleFollowUser = (username: string) => {
    toast({
      title: "Following User",
      description: `You are now following ${username}`,
    });
  };
  
  const handleShareStrategy = (id: string) => {
    toast({
      title: "Strategy Shared",
      description: "Strategy has been shared to your connections",
    });
  };
  
  const handleApplyStrategy = (id: string) => {
    toast({
      title: "Strategy Applied",
      description: "This strategy has been applied to your trading account",
    });
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Social Trading
        </CardTitle>
        <CardDescription>
          Discover and share trading strategies with the community
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="strategies">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="signals">Signals</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>
          
          <TabsContent value="strategies" className="space-y-6">
            <div className="space-y-4">
              {strategies.map(strategy => (
                <div key={strategy.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={strategy.userAvatar} />
                        <AvatarFallback>{strategy.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{strategy.username}</div>
                        <div className="text-sm text-muted-foreground">{new Date(strategy.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    {strategy.isVerified && (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-200 flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium">{strategy.strategyName}</h3>
                      <Badge variant="outline" className="text-xs">{strategy.timeframe}</Badge>
                    </div>
                    <p className="text-muted-foreground">{strategy.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="p-2 rounded-md bg-muted/50">
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                      <div className="font-medium">{strategy.performance.winRate}%</div>
                    </div>
                    <div className="p-2 rounded-md bg-muted/50">
                      <div className="text-xs text-muted-foreground">Profit Factor</div>
                      <div className="font-medium">{strategy.performance.profitFactor}</div>
                    </div>
                    <div className="p-2 rounded-md bg-muted/50">
                      <div className="text-xs text-muted-foreground">Net Profit</div>
                      <div className="font-medium">${strategy.performance.netProfit}</div>
                    </div>
                    <div className="p-2 rounded-md bg-muted/50">
                      <div className="text-xs text-muted-foreground">Trades</div>
                      <div className="font-medium">{strategy.performance.trades}</div>
                    </div>
                    <div className="p-2 rounded-md bg-muted/50">
                      <div className="text-xs text-muted-foreground">Sharpe</div>
                      <div className="font-medium">{strategy.performance.sharpeRatio}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {strategy.tags.map(tag => (
                      <Badge variant="secondary" key={tag}>#{tag}</Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleLikeStrategy(strategy.id)}>
                        <Heart className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <span className="text-sm text-muted-foreground">{strategy.likes}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleFollowUser(strategy.username)}>
                        <User className="h-4 w-4 mr-1" />
                        Follow
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleShareStrategy(strategy.id)}>
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button size="sm" onClick={() => handleApplyStrategy(strategy.id)}>
                        Apply Strategy
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <Button variant="outline">
                Load More Strategies
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="signals" className="space-y-6">
            <div className="space-y-4">
              {signals.map(signal => (
                <div key={signal.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={signal.userAvatar} />
                        <AvatarFallback>{signal.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{signal.username}</div>
                        <div className="text-sm text-muted-foreground">{new Date(signal.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <Badge 
                      variant={signal.direction === "buy" ? "outline" : "outline"}
                      className={`${signal.direction === "buy" ? "bg-green-500/10 text-green-500 border-green-200" : "bg-red-500/10 text-red-500 border-red-200"}`}
                    >
                      {signal.direction.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium">{signal.coin} ({signal.symbol})</h3>
                      <Badge variant="outline" className="text-xs">{signal.timeframe}</Badge>
                    </div>
                    <p className="text-muted-foreground">{signal.reasoning}</p>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 rounded-md bg-muted/50">
                      <div className="text-xs text-muted-foreground">Entry</div>
                      <div className="font-medium">${signal.price.toLocaleString()}</div>
                    </div>
                    <div className="p-2 rounded-md bg-muted/50">
                      <div className="text-xs text-muted-foreground">Target</div>
                      <div className="font-medium">${signal.targetPrice.toLocaleString()}</div>
                    </div>
                    <div className="p-2 rounded-md bg-muted/50">
                      <div className="text-xs text-muted-foreground">Stop Loss</div>
                      <div className="font-medium">${signal.stopLoss.toLocaleString()}</div>
                    </div>
                    <div className="p-2 rounded-md bg-muted/50">
                      <div className="text-xs text-muted-foreground">Confidence</div>
                      <div className="font-medium">{signal.confidence}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Expires: {new Date(signal.expiresAt).toLocaleString()}
                    </div>
                    
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-200">
                      {signal.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleLikeSignal(signal.id)}>
                        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <span className="text-sm text-muted-foreground">{signal.likes}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Comment
                      </Button>
                      <Button size="sm">
                        <Sparkles className="h-4 w-4 mr-1" />
                        Apply Signal
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <Button variant="outline">
                Load More Signals
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="community" className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-lg">Coming soon!</div>
              <p className="text-muted-foreground">
                Our community features are currently under development. Check back soon for forums, leaderboards, and competitions.
              </p>
              <Button variant="outline">
                Join Waitlist
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SocialTradingFeatures;
