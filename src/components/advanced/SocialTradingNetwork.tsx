
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, TrendingUp, Star, MessageCircle, Share2, Award } from "lucide-react";

interface Trader {
  id: string;
  username: string;
  avatar: string;
  followers: number;
  winRate: number;
  totalReturn: number;
  monthlyReturn: number;
  riskScore: number;
  verified: boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface TradingSignal {
  id: string;
  trader: Trader;
  pair: string;
  direction: 'buy' | 'sell';
  entry: number;
  target: number;
  stopLoss: number;
  confidence: number;
  timestamp: string;
  likes: number;
  comments: number;
}

const SocialTradingNetwork: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [followedTraders, setFollowedTraders] = useState<string[]>([]);

  const topTraders: Trader[] = [
    {
      id: '1',
      username: 'CryptoMaster_AU',
      avatar: '/placeholder-avatar.png',
      followers: 12450,
      winRate: 78.5,
      totalReturn: 245.6,
      monthlyReturn: 18.7,
      riskScore: 6.2,
      verified: true,
      tier: 'platinum'
    },
    {
      id: '2',
      username: 'AltcoinWhale',
      avatar: '/placeholder-avatar.png',
      followers: 8930,
      winRate: 71.3,
      totalReturn: 189.2,
      monthlyReturn: 15.4,
      riskScore: 7.8,
      verified: true,
      tier: 'gold'
    },
    {
      id: '3',
      username: 'TechAnalyst_Pro',
      avatar: '/placeholder-avatar.png',
      followers: 6720,
      winRate: 68.9,
      totalReturn: 167.8,
      monthlyReturn: 12.3,
      riskScore: 5.1,
      verified: false,
      tier: 'silver'
    }
  ];

  const tradingSignals: TradingSignal[] = [
    {
      id: '1',
      trader: topTraders[0],
      pair: 'BTC/USD',
      direction: 'buy',
      entry: 45200,
      target: 48500,
      stopLoss: 43000,
      confidence: 85,
      timestamp: '2 hours ago',
      likes: 147,
      comments: 23
    },
    {
      id: '2',
      trader: topTraders[1],
      pair: 'ETH/USD',
      direction: 'sell',
      entry: 3200,
      target: 2950,
      stopLoss: 3350,
      confidence: 72,
      timestamp: '4 hours ago',
      likes: 89,
      comments: 15
    },
    {
      id: '3',
      trader: topTraders[2],
      pair: 'SOL/USD',
      direction: 'buy',
      entry: 145,
      target: 165,
      stopLoss: 135,
      confidence: 68,
      timestamp: '6 hours ago',
      likes: 56,
      comments: 8
    }
  ];

  const followTrader = (traderId: string) => {
    setFollowedTraders(prev => [...prev, traderId]);
  };

  const unfollowTrader = (traderId: string) => {
    setFollowedTraders(prev => prev.filter(id => id !== traderId));
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'text-purple-500';
      case 'gold': return 'text-yellow-500';
      case 'silver': return 'text-gray-500';
      default: return 'text-orange-500';
    }
  };

  const getTierIcon = (tier: string) => {
    return <Award className={`h-4 w-4 ${getTierColor(tier)}`} />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Social Trading Network
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="competitions">Competitions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feed" className="space-y-4">
            <div className="space-y-4">
              {tradingSignals.map(signal => (
                <Card key={signal.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={signal.trader.avatar} alt={signal.trader.username} />
                        <AvatarFallback>{signal.trader.username[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{signal.trader.username}</span>
                          {signal.trader.verified && <Badge variant="secondary">Verified</Badge>}
                          {getTierIcon(signal.trader.tier)}
                          <span className="text-sm text-muted-foreground">{signal.timestamp}</span>
                        </div>
                        
                        <div className="bg-muted p-3 rounded-lg mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-lg">{signal.pair}</span>
                            <Badge variant={signal.direction === 'buy' ? 'default' : 'destructive'}>
                              {signal.direction.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Entry</div>
                              <div className="font-semibold">${signal.entry.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Target</div>
                              <div className="font-semibold text-green-500">${signal.target.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Stop Loss</div>
                              <div className="font-semibold text-red-500">${signal.stopLoss.toLocaleString()}</div>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <div className="text-muted-foreground text-sm">Confidence</div>
                            <div className="font-semibold">{signal.confidence}%</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              {signal.likes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {signal.comments}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <Button size="sm">Copy Trade</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="leaderboard" className="space-y-4">
            <div className="space-y-4">
              {topTraders.map((trader, index) => (
                <Card key={trader.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
                        <Avatar>
                          <AvatarImage src={trader.avatar} alt={trader.username} />
                          <AvatarFallback>{trader.username[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{trader.username}</span>
                            {trader.verified && <Badge variant="secondary">Verified</Badge>}
                            {getTierIcon(trader.tier)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {trader.followers.toLocaleString()} followers
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-sm text-muted-foreground">Win Rate</div>
                          <div className="font-semibold">{trader.winRate}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Total Return</div>
                          <div className="font-semibold text-green-500">+{trader.totalReturn}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Monthly</div>
                          <div className="font-semibold">+{trader.monthlyReturn}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Risk Score</div>
                          <div className="font-semibold">{trader.riskScore}/10</div>
                        </div>
                      </div>
                      
                      <Button
                        variant={followedTraders.includes(trader.id) ? "outline" : "default"}
                        size="sm"
                        onClick={() => followedTraders.includes(trader.id) 
                          ? unfollowTrader(trader.id) 
                          : followTrader(trader.id)
                        }
                      >
                        {followedTraders.includes(trader.id) ? 'Following' : 'Follow'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="following" className="space-y-4">
            {followedTraders.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">You're not following any traders yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Follow top traders to see their signals and copy their trades
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {topTraders
                  .filter(trader => followedTraders.includes(trader.id))
                  .map(trader => (
                    <Card key={trader.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={trader.avatar} alt={trader.username} />
                              <AvatarFallback>{trader.username[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold">{trader.username}</div>
                              <div className="text-sm text-muted-foreground">
                                {trader.followers.toLocaleString()} followers
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => unfollowTrader(trader.id)}
                          >
                            Unfollow
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="competitions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Trading Competition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Time Remaining</span>
                    <Badge variant="outline">15 days 7 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Prize Pool</span>
                    <span className="font-semibold">$50,000 AUD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Participants</span>
                    <span>2,847</span>
                  </div>
                  <Button className="w-full">Join Competition</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Trading Challenge</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Time Remaining</span>
                    <Badge variant="outline">3 days 12 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Prize Pool</span>
                    <span className="font-semibold">$25,000 AUD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Participants</span>
                    <span>1,523</span>
                  </div>
                  <Button className="w-full">Join Competition</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SocialTradingNetwork;
