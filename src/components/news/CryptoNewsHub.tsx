
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Newspaper, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  relatedAssets: string[];
}

const CryptoNewsHub: React.FC = () => {
  const { toast } = useToast();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // Mock news data - in production, this would connect to real news APIs
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: 'Bitcoin Reaches New Monthly High as Institutional Adoption Continues',
          summary: 'Major financial institutions continue to add Bitcoin to their portfolios, driving price momentum.',
          url: '#',
          source: 'CoinDesk',
          publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          sentiment: 'positive',
          confidence: 85,
          relatedAssets: ['BTC']
        },
        {
          id: '2',
          title: 'Ethereum 2.0 Staking Rewards Attract More Validators',
          summary: 'The Ethereum network sees increased staking participation as yields remain attractive.',
          url: '#',
          source: 'CoinTelegraph',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          sentiment: 'positive',
          confidence: 78,
          relatedAssets: ['ETH']
        },
        {
          id: '3',
          title: 'Regulatory Concerns Impact Altcoin Market Sentiment',
          summary: 'Recent regulatory announcements create uncertainty in the broader cryptocurrency market.',
          url: '#',
          source: 'CryptoPanic',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          sentiment: 'negative',
          confidence: 72,
          relatedAssets: ['SOL', 'ADA', 'DOT']
        },
        {
          id: '4',
          title: 'DeFi Protocol Launches New Yield Farming Opportunities',
          summary: 'New liquidity pools offer attractive yields for cryptocurrency holders.',
          url: '#',
          source: 'DeFi Pulse',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          sentiment: 'positive',
          confidence: 68,
          relatedAssets: ['UNI', 'AAVE', 'COMP']
        }
      ];
      
      setNews(mockNews);
    } catch (error) {
      toast({
        title: 'Error Loading News',
        description: 'Failed to fetch latest cryptocurrency news',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return TrendingUp;
      case 'negative': return AlertTriangle;
      default: return Clock;
    }
  };

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    return `${diffInHours} hours ago`;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All News</TabsTrigger>
          <TabsTrigger value="positive">Positive</TabsTrigger>
          <TabsTrigger value="negative">Negative</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Latest Crypto News</h2>
            <Button onClick={fetchNews} variant="outline" size="sm">
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {news.map(item => {
                const SentimentIcon = getSentimentIcon(item.sentiment);
                return (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Newspaper className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{item.source}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{timeAgo(item.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <SentimentIcon className={`h-4 w-4 ${getSentimentColor(item.sentiment)}`} />
                          <span className={`text-sm ${getSentimentColor(item.sentiment)}`}>
                            {item.confidence}%
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground mb-4">{item.summary}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {item.relatedAssets.map(asset => (
                            <Badge key={asset} variant="secondary" className="text-xs">
                              {asset}
                            </Badge>
                          ))}
                        </div>
                        <Badge variant={item.sentiment === 'positive' ? 'default' : item.sentiment === 'negative' ? 'destructive' : 'secondary'}>
                          {item.sentiment}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="positive" className="space-y-4">
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Positive News</h3>
            <p className="text-muted-foreground">Filtering for positive market sentiment...</p>
          </div>
        </TabsContent>

        <TabsContent value="negative" className="space-y-4">
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Market Concerns</h3>
            <p className="text-muted-foreground">Filtering for negative market sentiment...</p>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="text-center py-8">
            <Newspaper className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Market Analysis</h3>
            <p className="text-muted-foreground">In-depth analysis and research reports coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CryptoNewsHub;
