
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, TrendingUp, Copy, Star, MessageCircle } from 'lucide-react';

interface Trader {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  followers: number;
  winRate: number;
  totalReturn: number;
  monthlyReturn: number;
  copiers: number;
  verified: boolean;
  strategies: string[];
}

interface TradingSignal {
  id: string;
  trader: string;
  traderAvatar?: string;
  asset: string;
  action: 'BUY' | 'SELL';
  price: number;
  confidence: number;
  timestamp: string;
  reasoning: string;
  likes: number;
  comments: number;
}

const SocialTradingHub: React.FC = () => {
  const [topTraders] = useState<Trader[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      username: '@sarahcrypto',
      followers: 15420,
      winRate: 78.5,
      totalReturn: 245.8,
      monthlyReturn: 15.2,
      copiers: 892,
      verified: true,
      strategies: ['Swing Trading', 'DeFi']
    },
    {
      id: '2',
      name: 'Alex Rodriguez',
      username: '@alexbtc',
      followers: 12080,
      winRate: 72.1,
      totalReturn: 189.3,
      monthlyReturn: 12.7,
      copiers: 654,
      verified: true,
      strategies: ['Scalping', 'Technical Analysis']
    },
    {
      id: '3',
      name: 'Emma Thompson',
      username: '@emmatrader',
      followers: 8930,
      winRate: 81.2,
      totalReturn: 156.9,
      monthlyReturn: 18.5,
      copiers: 423,
      verified: false,
      strategies: ['Long-term', 'Fundamental Analysis']
    }
  ]);

  const [recentSignals] = useState<TradingSignal[]>([
    {
      id: '1',
      trader: 'Sarah Chen',
      asset: 'BTC',
      action: 'BUY',
      price: 63450,
      confidence: 85,
      timestamp: '2 hours ago',
      reasoning: 'Strong support at $63k, expecting breakout above $65k resistance',
      likes: 124,
      comments: 23
    },
    {
      id: '2',
      trader: 'Alex Rodriguez',
      asset: 'ETH',
      action: 'SELL',
      price: 3280,
      confidence: 72,
      timestamp: '4 hours ago',
      reasoning: 'RSI overbought, taking profits before potential correction',
      likes: 89,
      comments: 15
    },
    {
      id: '3',
      trader: 'Emma Thompson',
      asset: 'SOL',
      action: 'BUY',
      price: 142,
      confidence: 91,
      timestamp: '6 hours ago',
      reasoning: 'Ecosystem growth continues, fundamentals remain strong',
      likes: 156,
      comments: 31
    }
  ]);

  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [copying, setCopying] = useState<Set<string>>(new Set());

  const toggleFollow = (traderId: string) => {
    setFollowing(prev => {
      const newSet = new Set(prev);
      if (newSet.has(traderId)) {
        newSet.delete(traderId);
      } else {
        newSet.add(traderId);
      }
      return newSet;
    });
  };

  const toggleCopy = (traderId: string) => {
    setCopying(prev => {
      const newSet = new Set(prev);
      if (newSet.has(traderId)) {
        newSet.delete(traderId);
      } else {
        newSet.add(traderId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Trading Hub</h2>
          <p className="text-muted-foreground">Follow top traders and copy their strategies</p>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Find Traders
        </Button>
      </div>

      <Tabs defaultValue="traders" className="w-full">
        <TabsList>
          <TabsTrigger value="traders">Top Traders</TabsTrigger>
          <TabsTrigger value="signals">Trading Signals</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="traders" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topTraders.map((trader) => (
              <Card key={trader.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={trader.avatar} alt={trader.name} />
                        <AvatarFallback>{trader.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{trader.name}</span>
                          {trader.verified && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        </div>
                        <span className="text-sm text-muted-foreground">{trader.username}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Win Rate</p>
                      <p className="font-semibold text-green-600">{trader.winRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Monthly Return</p>
                      <p className="font-semibold text-green-600">+{trader.monthlyReturn}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Followers</p>
                      <p className="font-semibold">{trader.followers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Copiers</p>
                      <p className="font-semibold">{trader.copiers.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Strategies</p>
                    <div className="flex flex-wrap gap-1">
                      {trader.strategies.map((strategy, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {strategy}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={following.has(trader.id) ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => toggleFollow(trader.id)}
                    >
                      {following.has(trader.id) ? 'Following' : 'Follow'}
                    </Button>
                    <Button
                      variant={copying.has(trader.id) ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => toggleCopy(trader.id)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      {copying.has(trader.id) ? 'Copying' : 'Copy'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="signals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trading Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSignals.map((signal) => (
                  <div key={signal.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={signal.traderAvatar} alt={signal.trader} />
                          <AvatarFallback>{signal.trader.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{signal.trader}</span>
                          <span className="text-sm text-muted-foreground ml-2">{signal.timestamp}</span>
                        </div>
                      </div>
                      <Badge variant={signal.action === 'BUY' ? 'default' : 'destructive'}>
                        {signal.action} {signal.asset}
                      </Badge>
                    </div>
                    
                    <p className="text-sm mb-3">{signal.reasoning}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span>Price: ${signal.price.toLocaleString()}</span>
                        <span>Confidence: {signal.confidence}%</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                          <TrendingUp className="h-4 w-4" />
                          {signal.likes}
                        </button>
                        <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                          <MessageCircle className="h-4 w-4" />
                          {signal.comments}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Trader Leaderboard</h3>
            <p className="text-muted-foreground">Competition rankings coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your Social Portfolio</h3>
            <p className="text-muted-foreground">Track your followed traders and copied strategies...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialTradingHub;
