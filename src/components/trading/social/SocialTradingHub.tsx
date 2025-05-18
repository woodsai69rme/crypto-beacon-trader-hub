
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Users, Star, TrendingUp, Clock, Sliders, Share2 } from "lucide-react";

type SortOption = 'popular' | 'performance' | 'newest';
type TraderCategory = 'all' | 'whales' | 'day-traders' | 'hodlers' | 'ai-traders';

interface Trader {
  id: string;
  name: string;
  avatar?: string;
  performance: {
    monthly: number;
    yearly: number;
  };
  followers: number;
  risk: 'low' | 'medium' | 'high';
  category: string[];
  verified: boolean;
  fee?: number;
  copiers: number;
}

interface TradingStrategy {
  id: string;
  name: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
  };
  description: string;
  performance: {
    monthly: number;
    yearly: number;
    winRate: number;
  };
  tags: string[];
  downloads: number;
  price: number | 'free';
  rating: number;
}

const mockTraders: Trader[] = [
  {
    id: '1',
    name: 'CryptoWhale',
    avatar: '/avatars/whale.png',
    performance: { monthly: 18.5, yearly: 127.8 },
    followers: 5683,
    risk: 'medium',
    category: ['whales', 'hodlers'],
    verified: true,
    fee: 2.5,
    copiers: 342
  },
  {
    id: '2',
    name: 'TradingMaster',
    avatar: '/avatars/master.png',
    performance: { monthly: 24.3, yearly: 156.2 },
    followers: 3245,
    risk: 'high',
    category: ['day-traders'],
    verified: true,
    fee: 3,
    copiers: 278
  },
  {
    id: '3',
    name: 'AIAlgoTrader',
    performance: { monthly: 12.8, yearly: 98.5 },
    followers: 2891,
    risk: 'low',
    category: ['ai-traders'],
    verified: false,
    copiers: 157
  },
  {
    id: '4',
    name: 'HodlGang',
    performance: { monthly: 8.4, yearly: 112.7 },
    followers: 1457,
    risk: 'low',
    category: ['hodlers'],
    verified: false,
    fee: 1.5,
    copiers: 89
  },
];

const mockStrategies: TradingStrategy[] = [
  {
    id: '1',
    name: 'BTC Breakout Master',
    author: {
      id: '1',
      name: 'CryptoWhale',
      avatar: '/avatars/whale.png',
      verified: true
    },
    description: 'Identifies and trades BTC breakouts with high precision using volatility-based entry/exit',
    performance: {
      monthly: 14.2,
      yearly: 87.5,
      winRate: 68
    },
    tags: ['Breakout', 'BTC', 'Momentum'],
    downloads: 1245,
    price: 'free',
    rating: 4.7
  },
  {
    id: '2',
    name: 'DeFi Yield Maximizer',
    author: {
      id: '2',
      name: 'TradingMaster',
      avatar: '/avatars/master.png',
      verified: true
    },
    description: 'Rotates assets between top DeFi protocols to maximize yield while managing risk',
    performance: {
      monthly: 8.7,
      yearly: 64.3,
      winRate: 82
    },
    tags: ['DeFi', 'Yield', 'Ethereum'],
    downloads: 876,
    price: 25,
    rating: 4.5
  },
  {
    id: '3',
    name: 'AI Sentiment Trader',
    author: {
      id: '3',
      name: 'AIAlgoTrader',
      verified: false
    },
    description: 'Uses AI to analyze news and social media sentiment to predict price movements',
    performance: {
      monthly: 19.3,
      yearly: 105.8,
      winRate: 64
    },
    tags: ['AI', 'Sentiment', 'Multi-coin'],
    downloads: 742,
    price: 50,
    rating: 4.2
  },
];

const SocialTradingHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('copy-trading');
  const [sortOption, setSortOption] = useState<SortOption>('performance');
  const [traderCategory, setTraderCategory] = useState<TraderCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTraders = mockTraders.filter(trader => {
    if (traderCategory !== 'all' && !trader.category.includes(traderCategory)) {
      return false;
    }
    if (searchQuery && !trader.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (sortOption) {
      case 'popular':
        return b.followers - a.followers;
      case 'performance':
        return b.performance.monthly - a.performance.monthly;
      case 'newest':
        return 0; // In a real app, would sort by join date
      default:
        return 0;
    }
  });
  
  const filteredStrategies = mockStrategies.filter(strategy => {
    if (searchQuery && !strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !strategy.author.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Trading Hub</CardTitle>
        <CardDescription>
          Follow top traders and share winning strategies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="copy-trading">
              <Users className="h-4 w-4 mr-2" />
              Copy Trading
            </TabsTrigger>
            <TabsTrigger value="strategies">
              <Sliders className="h-4 w-4 mr-2" />
              Trading Strategies
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="copy-trading">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search traders..." 
                    className="pl-10" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant={sortOption === 'popular' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSortOption('popular')}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Popular
                  </Button>
                  <Button 
                    variant={sortOption === 'performance' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSortOption('performance')}
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Performance
                  </Button>
                  <Button 
                    variant={sortOption === 'newest' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSortOption('newest')}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Newest
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                <Badge 
                  variant={traderCategory === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setTraderCategory('all')}
                >
                  All Traders
                </Badge>
                <Badge 
                  variant={traderCategory === 'whales' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setTraderCategory('whales')}
                >
                  Whales
                </Badge>
                <Badge 
                  variant={traderCategory === 'day-traders' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setTraderCategory('day-traders')}
                >
                  Day Traders
                </Badge>
                <Badge 
                  variant={traderCategory === 'hodlers' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setTraderCategory('hodlers')}
                >
                  HODLers
                </Badge>
                <Badge 
                  variant={traderCategory === 'ai-traders' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setTraderCategory('ai-traders')}
                >
                  AI Traders
                </Badge>
              </div>
              
              <div className="space-y-4">
                {filteredTraders.length > 0 ? filteredTraders.map(trader => (
                  <div key={trader.id} className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={trader.avatar} />
                          <AvatarFallback>{trader.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{trader.name}</h4>
                            {trader.verified && (
                              <Badge variant="outline" className="ml-2 bg-blue-50">
                                <Star className="h-3 w-3 text-blue-500 mr-1" fill="currentColor" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {trader.followers.toLocaleString()} followers • {trader.copiers} copiers
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${trader.performance.monthly > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {trader.performance.monthly > 0 ? '+' : ''}{trader.performance.monthly}%
                          <span className="text-xs text-muted-foreground ml-1">30d</span>
                        </div>
                        <div className="text-sm">
                          {trader.performance.yearly > 0 ? '+' : ''}{trader.performance.yearly}% 
                          <span className="text-xs text-muted-foreground ml-1">1y</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex gap-2">
                        <Badge variant="outline" className={`
                          ${trader.risk === 'low' ? 'bg-green-50 text-green-700' : 
                            trader.risk === 'medium' ? 'bg-yellow-50 text-yellow-700' : 
                            'bg-red-50 text-red-700'}
                        `}>
                          {trader.risk === 'low' ? 'Low Risk' : 
                            trader.risk === 'medium' ? 'Medium Risk' : 
                            'High Risk'}
                        </Badge>
                        {trader.category.map(cat => (
                          <Badge key={cat} variant="outline">
                            {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        {trader.fee && (
                          <span className="text-sm text-muted-foreground">
                            {trader.fee}% fee
                          </span>
                        )}
                        <Button size="sm">
                          Copy Trader
                        </Button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No traders match your filters
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="strategies">
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search strategies..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end">
                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Your Strategy
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStrategies.length > 0 ? filteredStrategies.map(strategy => (
                  <div key={strategy.id} className="border rounded-md p-4">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{strategy.name}</h4>
                      <Badge variant={strategy.price === 'free' ? 'outline' : 'secondary'}>
                        {strategy.price === 'free' ? 'Free' : `$${strategy.price}`}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center mt-2">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={strategy.author.avatar} />
                        <AvatarFallback>{strategy.author.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">by {strategy.author.name}</span>
                      {strategy.author.verified && (
                        <Star className="h-3 w-3 text-blue-500 ml-1" fill="currentColor" />
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {strategy.description}
                    </p>
                    
                    <div className="flex justify-between mt-3">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className={`font-medium ${strategy.performance.monthly > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {strategy.performance.monthly > 0 ? '+' : ''}{strategy.performance.monthly}%
                          </div>
                          <div className="text-xs text-muted-foreground">30d return</div>
                        </div>
                        <div>
                          <div className="font-medium">{strategy.performance.winRate}%</div>
                          <div className="text-xs text-muted-foreground">Win rate</div>
                        </div>
                        <div>
                          <div className="font-medium">{strategy.downloads}</div>
                          <div className="text-xs text-muted-foreground">Downloads</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-1 flex-wrap">
                        {strategy.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm">
                        Use Strategy
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    No strategies match your search
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SocialTradingHub;
