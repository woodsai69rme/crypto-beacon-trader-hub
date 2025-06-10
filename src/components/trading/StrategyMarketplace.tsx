
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Download, TrendingUp, Shield, Search, Filter } from 'lucide-react';

const StrategyMarketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  const strategies = [
    {
      id: '1',
      name: 'Golden Cross Momentum',
      description: 'A proven trend-following strategy using moving average crossovers',
      creator: 'TradingPro',
      creatorAvatar: '/avatars/user1.png',
      category: 'trend-following',
      price: 'AUD $29.99',
      rating: 4.8,
      downloads: 1247,
      winRate: 68.5,
      return: 24.3,
      drawdown: 8.2,
      timeframe: '4h',
      featured: true,
      tags: ['Moving Average', 'Momentum', 'Trending Markets']
    },
    {
      id: '2',
      name: 'Mean Reversion Master',
      description: 'Advanced mean reversion strategy with RSI and Bollinger Bands',
      creator: 'AlgoExpert',
      creatorAvatar: '/avatars/user2.png',
      category: 'mean-reversion',
      price: 'AUD $19.99',
      rating: 4.6,
      downloads: 856,
      winRate: 72.1,
      return: 18.7,
      drawdown: 6.5,
      timeframe: '1h',
      featured: false,
      tags: ['RSI', 'Bollinger Bands', 'Range Markets']
    },
    {
      id: '3',
      name: 'AI Sentiment Trader',
      description: 'Uses AI to analyze news sentiment and social media trends',
      creator: 'AITrader',
      creatorAvatar: '/avatars/user3.png',
      category: 'sentiment',
      price: 'AUD $49.99',
      rating: 4.9,
      downloads: 2156,
      winRate: 65.3,
      return: 32.1,
      drawdown: 12.4,
      timeframe: '1d',
      featured: true,
      tags: ['AI', 'Sentiment', 'News Analysis', 'Social Media']
    },
    {
      id: '4',
      name: 'Scalping Lightning',
      description: 'High-frequency scalping strategy for quick profits',
      creator: 'ScalpMaster',
      creatorAvatar: '/avatars/user4.png',
      category: 'scalping',
      price: 'AUD $39.99',
      rating: 4.4,
      downloads: 634,
      winRate: 58.7,
      return: 45.6,
      drawdown: 18.9,
      timeframe: '1m',
      featured: false,
      tags: ['Scalping', 'High Frequency', 'Quick Profits']
    },
    {
      id: '5',
      name: 'DeFi Yield Hunter',
      description: 'Automated strategy for DeFi yield farming opportunities',
      creator: 'DeFiMaster',
      creatorAvatar: '/avatars/user5.png',
      category: 'defi',
      price: 'AUD $35.99',
      rating: 4.7,
      downloads: 423,
      winRate: 78.2,
      return: 28.9,
      drawdown: 9.1,
      timeframe: '1d',
      featured: false,
      tags: ['DeFi', 'Yield Farming', 'Liquidity Mining']
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'trend-following', label: 'Trend Following' },
    { value: 'mean-reversion', label: 'Mean Reversion' },
    { value: 'scalping', label: 'Scalping' },
    { value: 'sentiment', label: 'Sentiment Analysis' },
    { value: 'defi', label: 'DeFi Strategies' }
  ];

  const filteredStrategies = strategies.filter(strategy => {
    const matchesSearch = strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strategy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || strategy.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Strategy Marketplace</h2>
          <p className="text-muted-foreground">Discover and purchase proven trading strategies</p>
        </div>
        <Button>Publish Strategy</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search strategies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Most Popular</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="return">Best Returns</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Featured Strategies */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Featured Strategies</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredStrategies.filter(s => s.featured).map(strategy => (
            <Card key={strategy.id} className="overflow-hidden border-2 border-yellow-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Featured</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{strategy.rating}</span>
                  </div>
                </div>
                <CardTitle className="flex items-center justify-between">
                  {strategy.name}
                  <span className="text-lg font-bold text-green-600">{strategy.price}</span>
                </CardTitle>
                <p className="text-muted-foreground">{strategy.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={strategy.creatorAvatar} />
                    <AvatarFallback>{strategy.creator[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{strategy.creator}</div>
                    <div className="text-xs text-muted-foreground">{strategy.downloads} downloads</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-500">{strategy.winRate}%</div>
                    <div className="text-xs text-muted-foreground">Win Rate</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-500">+{strategy.return}%</div>
                    <div className="text-xs text-muted-foreground">Returns</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-500">{strategy.drawdown}%</div>
                    <div className="text-xs text-muted-foreground">Max DD</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {strategy.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Purchase
                  </Button>
                  <Button variant="outline">Preview</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Strategies */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Strategies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStrategies.filter(s => !s.featured).map(strategy => (
            <Card key={strategy.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{strategy.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{strategy.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{strategy.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{strategy.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={strategy.creatorAvatar} />
                    <AvatarFallback>{strategy.creator[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{strategy.creator}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-green-500">{strategy.winRate}%</div>
                    <div className="text-xs text-muted-foreground">Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-500">+{strategy.return}%</div>
                    <div className="text-xs text-muted-foreground">Returns</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-green-600">{strategy.price}</span>
                  <Button size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    Buy
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StrategyMarketplace;
