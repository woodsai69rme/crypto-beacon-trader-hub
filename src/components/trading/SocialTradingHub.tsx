
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Share2, TrendingUp, Users, Star, Copy } from 'lucide-react';

const SocialTradingHub: React.FC = () => {
  const [following, setFollowing] = useState<string[]>([]);

  const traders = [
    {
      id: '1',
      name: 'Alex Chen',
      username: '@alextrader',
      avatar: '/avatars/trader1.png',
      verified: true,
      followers: 12400,
      return: 28.5,
      winRate: 73.2,
      trades: 156,
      copiers: 890,
      description: 'Professional trader specializing in crypto momentum strategies',
      lastTrade: { symbol: 'BTC', type: 'buy', profit: 5.2, time: '2h ago' }
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      username: '@sarahdefi',
      avatar: '/avatars/trader2.png',
      verified: true,
      followers: 8900,
      return: 22.1,
      winRate: 68.7,
      trades: 98,
      copiers: 456,
      description: 'DeFi yield farming expert and risk management specialist',
      lastTrade: { symbol: 'ETH', type: 'sell', profit: 3.8, time: '4h ago' }
    },
    {
      id: '3',
      name: 'Mike Rodriguez',
      username: '@mikescalp',
      avatar: '/avatars/trader3.png',
      verified: false,
      followers: 3200,
      return: 45.6,
      winRate: 61.3,
      trades: 423,
      copiers: 234,
      description: 'Scalping specialist focusing on high-frequency trades',
      lastTrade: { symbol: 'SOL', type: 'buy', profit: 2.1, time: '1h ago' }
    }
  ];

  const socialPosts = [
    {
      id: '1',
      author: 'Alex Chen',
      username: '@alextrader',
      avatar: '/avatars/trader1.png',
      time: '2h ago',
      content: 'Just closed a profitable BTC long position. The momentum indicators are showing strong bullish signals. Next target: $65,000 📈',
      likes: 89,
      comments: 23,
      shares: 12,
      trade: { symbol: 'BTC', entry: 58500, exit: 61500, profit: 5.13 }
    },
    {
      id: '2',
      author: 'Sarah Johnson',
      username: '@sarahdefi',
      avatar: '/avatars/trader2.png',
      time: '4h ago',
      content: 'DeFi yields are looking attractive again. Spotted some opportunities in the AAVE ecosystem. Risk/reward ratio is favorable.',
      likes: 67,
      comments: 18,
      shares: 8,
      strategy: 'DeFi Yield Farming'
    },
    {
      id: '3',
      author: 'Mike Rodriguez',
      username: '@mikescalp',
      avatar: '/avatars/trader3.png',
      time: '6h ago',
      content: 'Market volatility is perfect for scalping today. Caught 5 quick trades on SOL with average 2% gains each. 🚀',
      likes: 45,
      comments: 12,
      shares: 6,
      trades: 5,
      avgProfit: 2.1
    }
  ];

  const handleFollow = (traderId: string) => {
    setFollowing(prev => 
      prev.includes(traderId) 
        ? prev.filter(id => id !== traderId)
        : [...prev, traderId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Trading Hub</h2>
          <p className="text-muted-foreground">Follow top traders and copy their strategies</p>
        </div>
        <Button>
          <Share2 className="h-4 w-4 mr-2" />
          Share Trade
        </Button>
      </div>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList>
          <TabsTrigger value="feed">Trading Feed</TabsTrigger>
          <TabsTrigger value="traders">Top Traders</TabsTrigger>
          <TabsTrigger value="copytrade">Copy Trading</TabsTrigger>
          <TabsTrigger value="signals">Trading Signals</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          {socialPosts.map(post => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{post.author}</span>
                      <span className="text-sm text-muted-foreground">{post.username}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{post.time}</span>
                    </div>
                    <p className="mb-3">{post.content}</p>
                    
                    {post.trade && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{post.trade.symbol} Trade</div>
                            <div className="text-sm text-muted-foreground">
                              Entry: ${post.trade.entry} → Exit: ${post.trade.exit}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              +{post.trade.profit}%
                            </div>
                            <div className="text-sm text-muted-foreground">Profit</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-red-500">
                        <Heart className="h-4 w-4" />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-500">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </button>
                      <button className="flex items-center gap-1 hover:text-green-500">
                        <Share2 className="h-4 w-4" />
                        {post.shares}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="traders" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {traders.map(trader => (
              <Card key={trader.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={trader.avatar} />
                        <AvatarFallback>{trader.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">{trader.name}</span>
                          {trader.verified && (
                            <Star className="h-4 w-4 fill-blue-500 text-blue-500" />
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">{trader.username}</span>
                      </div>
                    </div>
                    <Button
                      variant={following.includes(trader.id) ? "secondary" : "default"}
                      size="sm"
                      onClick={() => handleFollow(trader.id)}
                    >
                      {following.includes(trader.id) ? 'Following' : 'Follow'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{trader.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-500">+{trader.return}%</div>
                      <div className="text-xs text-muted-foreground">Total Return</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{trader.winRate}%</div>
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{trader.trades}</div>
                      <div className="text-xs text-muted-foreground">Trades</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{trader.copiers}</div>
                      <div className="text-xs text-muted-foreground">Copiers</div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg mb-4">
                    <div className="text-sm font-medium">Last Trade</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{trader.lastTrade.symbol} {trader.lastTrade.type}</span>
                      <span className="text-sm font-bold text-green-500">
                        +{trader.lastTrade.profit}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{trader.lastTrade.time}</div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Trader
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="copytrade" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Copy Trading Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Copy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start Copy Trading</h3>
                <p className="text-muted-foreground mb-4">
                  Automatically copy trades from successful traders
                </p>
                <Button>Set Up Copy Trading</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trading Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Trading Signals</h3>
                <p className="text-muted-foreground mb-4">
                  Get real-time trading signals from AI and expert traders
                </p>
                <Button>Subscribe to Signals</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialTradingHub;
