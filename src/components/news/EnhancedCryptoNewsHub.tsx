import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NewsItem } from '@/types/trading';
import { Newspaper, TrendingUp, AlertTriangle, Search, ExternalLink } from 'lucide-react';

const EnhancedCryptoNewsHub: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock news data - in production, this would come from real APIs
  useEffect(() => {
    const mockNews: NewsItem[] = [
      {
        id: '1',
        title: 'Bitcoin Reaches New All-Time High as Institutional Adoption Grows',
        content: 'Bitcoin has surged to unprecedented levels as major institutions continue to add cryptocurrency to their balance sheets. The latest rally has been driven by renewed interest from pension funds and corporate treasuries.',
        description: 'Bitcoin hits new highs amid institutional adoption',
        url: 'https://example.com/news/1',
        source: 'CoinDesk',
        publishedAt: new Date().toISOString(),
        sentiment: 'positive',
        relevantCoins: ['bitcoin', 'btc'],
        isFake: false,
        confidence: 0.98
      },
      {
        id: '2',
        title: 'Ethereum 2.0 Staking Rewards Hit Record High',
        content: 'ETH staking yields have reached their highest point in 2024, attracting more validators to the network. The increased participation is contributing to network security and decentralization.',
        description: 'Ethereum staking rewards reach new records',
        url: 'https://example.com/news/2',
        source: 'CoinTelegraph',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        sentiment: 'positive',
        relevantCoins: ['ethereum', 'eth'],
        isFake: false,
        confidence: 0.92
      },
      {
        id: '3',
        title: 'Regulatory Concerns Impact Crypto Market Sentiment',
        content: 'New regulatory proposals have created uncertainty in the cryptocurrency market, leading to increased volatility. Traders are closely watching for further developments from regulatory bodies.',
        description: 'Regulatory uncertainty affects crypto markets',
        url: 'https://example.com/news/3',
        source: 'CryptoPanic',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        sentiment: 'negative',
        relevantCoins: ['bitcoin', 'ethereum'],
        isFake: false,
        confidence: 0.85
      },
      {
        id: '4',
        title: 'DeFi Protocol Launches Revolutionary Yield Farming Feature',
        content: 'A major DeFi protocol has introduced a new yield farming mechanism that promises higher returns with lower risk. The innovative approach combines liquidity mining with automated risk management.',
        description: 'New DeFi yield farming innovation launched',
        url: 'https://example.com/news/4',
        source: 'DeFi Pulse',
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        sentiment: 'positive',
        relevantCoins: ['ethereum', 'defi'],
        isFake: false,
        confidence: 0.89
      },
      {
        id: '5',
        title: 'SUSPECTED: Major Exchange Hack Reported - Unverified Claims',
        content: 'Unconfirmed reports suggest a major cryptocurrency exchange may have been compromised. Official statements are pending and users are advised to exercise caution.',
        description: 'Unverified reports of exchange security incident',
        url: 'https://example.com/news/5',
        source: 'Unknown Source',
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        sentiment: 'negative',
        relevantCoins: ['bitcoin', 'ethereum'],
        isFake: true,
        confidence: 0.45
      }
    ];

    setNews(mockNews);
    setFilteredNews(mockNews);
  }, []);

  useEffect(() => {
    let filtered = news;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item =>
        item.tags?.includes(selectedCategory)
      );
    }

    setFilteredNews(filtered);
  }, [searchTerm, selectedCategory, news]);

  const getSentimentBadgeVariant = (sentiment: string | undefined) => {
    switch (sentiment) {
      case 'positive': return 'default';
      case 'negative': return 'destructive';
      default: return 'secondary';
    }
  };

  const NewsCard: React.FC<{ item: NewsItem }> = ({ item }) => (
    <Card className={`${item.isFake ? 'border-red-200 bg-red-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium leading-tight">{item.title}</CardTitle>
          <div className="flex items-center space-x-2 ml-2">
            {item.isFake && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Suspected Fake
              </Badge>
            )}
            <Badge variant={getSentimentBadgeVariant(item.sentiment)} className="text-xs">
              {item.sentiment}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3">{item.content}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>{item.source}</span>
            <span>{new Date(item.publishedAt).toLocaleTimeString()}</span>
            <span>Confidence: {(item.confidence! * 100).toFixed(0)}%</span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
        {item.tags && (
          <div className="flex gap-1 mt-2">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const categories = ['all', 'Bitcoin', 'Ethereum', 'DeFi', 'Regulation', 'Market', 'Security'];
  const positiveNews = filteredNews.filter(item => item.sentiment === 'positive');
  const negativeNews = filteredNews.filter(item => item.sentiment === 'negative');
  const suspiciousNews = filteredNews.filter(item => item.isFake);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredNews.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{positiveNews.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negative Sentiment</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{negativeNews.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspicious News</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{suspiciousNews.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All News</TabsTrigger>
          <TabsTrigger value="positive">Positive</TabsTrigger>
          <TabsTrigger value="negative">Negative</TabsTrigger>
          <TabsTrigger value="suspicious">Suspicious</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredNews.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </TabsContent>
        
        <TabsContent value="positive" className="space-y-4">
          {positiveNews.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </TabsContent>
        
        <TabsContent value="negative" className="space-y-4">
          {negativeNews.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </TabsContent>
        
        <TabsContent value="suspicious" className="space-y-4">
          {suspiciousNews.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
          {suspiciousNews.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No suspicious news detected. Our AI filtering is working well!
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCryptoNewsHub;
