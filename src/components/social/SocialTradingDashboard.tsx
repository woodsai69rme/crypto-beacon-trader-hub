
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, TrendingUp, Copy, Heart, MessageCircle, Share } from 'lucide-react';

interface Trader {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  followers: number;
  winRate: number;
  totalReturn: number;
  monthlyReturn: number;
  riskScore: number;
  isFollowing: boolean;
}

interface TradingSignal {
  id: string;
  trader: Trader;
  action: 'BUY' | 'SELL';
  asset: string;
  price: number;
  confidence: number;
  timestamp: Date;
  likes: number;
  comments: number;
}

const SocialTradingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'signals' | 'portfolio'>('leaderboard');
  
  const [topTraders] = useState<Trader[]>([
    {
      id: '1',
      name: 'Alex Chen',
      username: '@alextrader',
      followers: 2430,
      winRate: 78.5,
      totalReturn: 156.8,
      monthlyReturn: 12.4,
      riskScore: 3,
      isFollowing: false
    },
    {
      id: '2',
      name: 'Sarah Mitchell',
      username: '@sarahcrypto',
      followers: 1850,
      winRate: 72.1,
      totalReturn: 134.2,
      monthlyReturn: 9.8,
      riskScore: 2,
      isFollowing: true
    },
    {
      id: '3',
      name: 'Mike Johnson',
      username: '@mikej_trades',
      followers: 3120,
      winRate: 65.3,
      totalReturn: 189.5,
      monthlyReturn: 15.2,
      riskScore: 4,
      isFollowing: false
    }
  ]);

  const [tradingSignals] = useState<TradingSignal[]>([
    {
      id: '1',
      trader: topTraders[0],
      action: 'BUY',
      asset: 'BTC',
      price: 65000,
      confidence: 85,
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      likes: 24,
      comments: 8
    },
    {
      id: '2',
      trader: topTraders[1],
      action: 'SELL',
      asset: 'ETH',
      price: 3500,
      confidence: 72,
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      likes: 18,
      comments: 12
    }
  ]);

  const handleFollow = (traderId: string) => {
    // Simulate following a trader
    console.log(`Following trader ${traderId}`);
  };

  const handleCopyTrade = (signalId: string) => {
    // Simulate copying a trade
    console.log(`Copying trade ${signalId}`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRiskColor = (score: number) => {
    if (score <= 2) return 'text-green-600';
    if (score <= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskLabel = (score: number) => {
    if (score <= 2) return 'Low';
    if (score <= 3) return 'Medium';
    return 'High';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Trading</h2>
          <p className="text-muted-foreground">Follow top traders and copy their strategies</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            <Users className="h-3 w-3 mr-1" />
            Community
          </Badge>
        </div>
      </div>

      <div className="flex gap-2 border-b">
        {[
          { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp },
          { id: 'signals', label: 'Trading Signals', icon: Share },
          { id: 'portfolio', label: 'My Following', icon: Users }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {activeTab === 'leaderboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {topTraders.map(trader => (
            <Card key={trader.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={trader.avatar} alt={trader.name} />
                    <AvatarFallback>{trader.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{trader.name}</CardTitle>
                    <CardDescription>{trader.username}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Followers</p>
                    <p className="font-semibold">{trader.followers.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Win Rate</p>
                    <p className="font-semibold text-green-600">{trader.winRate}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Return</p>
                    <p className="font-semibold text-green-600">+{trader.totalReturn}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly</p>
                    <p className="font-semibold text-green-600">+{trader.monthlyReturn}%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <p className={`font-semibold ${getRiskColor(trader.riskScore)}`}>
                      {getRiskLabel(trader.riskScore)}
                    </p>
                  </div>
                  <Button
                    variant={trader.isFollowing ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => handleFollow(trader.id)}
                  >
                    {trader.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'signals' && (
        <div className="space-y-4">
          {tradingSignals.map(signal => (
            <Card key={signal.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>{signal.trader.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{signal.trader.name}</span>
                        <span className="text-sm text-muted-foreground">{signal.trader.username}</span>
                        <Badge variant={signal.action === 'BUY' ? 'default' : 'destructive'}>
                          {signal.action}
                        </Badge>
                      </div>
                      <p className="text-lg font-semibold">
                        {signal.action} {signal.asset} at {formatCurrency(signal.price)}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Confidence: {signal.confidence}% • {signal.timestamp.toLocaleTimeString()}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-foreground">
                          <Heart className="h-4 w-4" />
                          {signal.likes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-foreground">
                          <MessageCircle className="h-4 w-4" />
                          {signal.comments}
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyTrade(signal.id)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Trade
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'portfolio' && (
        <Card>
          <CardHeader>
            <CardTitle>Following</CardTitle>
            <CardDescription>Traders you're currently following</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTraders.filter(t => t.isFollowing).map(trader => (
                <div key={trader.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{trader.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{trader.name}</p>
                      <p className="text-sm text-muted-foreground">{trader.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-semibold">+{trader.monthlyReturn}%</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SocialTradingDashboard;
