
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, AlertTriangle, Eye, Share2, ThumbsUp } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  isFakeNews: boolean;
  fakeNewsConfidence: number;
  relatedAssets: string[];
  engagement: {
    views: number;
    shares: number;
    likes: number;
  };
}

const NewsAnalytics: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [sentimentTrend, setSentimentTrend] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data generation
  useEffect(() => {
    const mockNewsItems: NewsItem[] = [
      {
        id: '1',
        title: 'Bitcoin Reaches New All-Time High as Institutional Adoption Grows',
        content: 'Bitcoin has surged to unprecedented levels as major corporations continue to add cryptocurrency to their treasury reserves...',
        source: 'CoinDesk',
        publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        sentiment: 'positive',
        sentimentScore: 0.85,
        isFakeNews: false,
        fakeNewsConfidence: 0.05,
        relatedAssets: ['BTC', 'ETH'],
        engagement: { views: 12500, shares: 245, likes: 1200 }
      },
      {
        id: '2',
        title: 'Ethereum 2.0 Staking Rewards Hit Record High',
        content: 'The latest Ethereum upgrade has resulted in increased staking rewards, attracting more validators to the network...',
        source: 'CoinTelegraph',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        sentiment: 'positive',
        sentimentScore: 0.72,
        isFakeNews: false,
        fakeNewsConfidence: 0.08,
        relatedAssets: ['ETH'],
        engagement: { views: 8900, shares: 156, likes: 892 }
      },
      {
        id: '3',
        title: 'BREAKING: Major Exchange Faces Security Breach',
        content: 'Reports suggest that a prominent cryptocurrency exchange may have experienced unauthorized access to user funds...',
        source: 'CryptoPanic',
        publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        sentiment: 'negative',
        sentimentScore: -0.68,
        isFakeNews: true,
        fakeNewsConfidence: 0.92,
        relatedAssets: ['BTC', 'ETH', 'USDT'],
        engagement: { views: 15600, shares: 489, likes: 234 }
      }
    ];

    setNewsItems(mockNewsItems);

    // Mock sentiment trend data
    const trendData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      sentiment: Math.random() * 2 - 1, // -1 to 1
      volume: Math.floor(Math.random() * 100) + 20
    }));
    setSentimentTrend(trendData);
  }, []);

  const refreshNews = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
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
      case 'positive': return <TrendingUp className="h-4 w-4" />;
      case 'negative': return <TrendingDown className="h-4 w-4" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const overallSentiment = newsItems.length > 0 
    ? newsItems.reduce((sum, item) => sum + item.sentimentScore, 0) / newsItems.length 
    : 0;

  const fakeNewsCount = newsItems.filter(item => item.isFakeNews).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">News Analytics & Sentiment</h2>
        <Button onClick={refreshNews} disabled={isLoading}>
          {isLoading ? 'Refreshing...' : 'Refresh News'}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Sentiment</p>
                <p className={`text-2xl font-bold ${overallSentiment >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {(overallSentiment * 100).toFixed(1)}%
                </p>
              </div>
              {overallSentiment >= 0 ? 
                <TrendingUp className="h-8 w-8 text-green-500" /> : 
                <TrendingDown className="h-8 w-8 text-red-500" />
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Articles</p>
                <p className="text-2xl font-bold">{newsItems.length}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fake News Detected</p>
                <p className="text-2xl font-bold text-red-500">{fakeNewsCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Engagement</p>
                <p className="text-2xl font-bold">
                  {newsItems.length > 0 
                    ? Math.round(newsItems.reduce((sum, item) => sum + item.engagement.views, 0) / newsItems.length)
                    : 0}
                </p>
              </div>
              <Share2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="articles" className="w-full">
        <TabsList>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Trends</TabsTrigger>
          <TabsTrigger value="fake-news">Fake News Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4">
          {newsItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{item.content}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{item.source}</span>
                        <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{item.engagement.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" />
                          <span>{item.engagement.shares}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{item.engagement.likes}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 space-y-2">
                      <div className={`flex items-center gap-1 ${getSentimentColor(item.sentiment)}`}>
                        {getSentimentIcon(item.sentiment)}
                        <span className="text-sm font-medium">{item.sentiment}</span>
                      </div>
                      
                      {item.isFakeNews && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Fake News
                        </Badge>
                      )}
                      
                      <div className="flex flex-wrap gap-1">
                        {item.relatedAssets.map((asset) => (
                          <Badge key={asset} variant="outline" className="text-xs">
                            {asset}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sentiment Score</span>
                      <span>{(item.sentimentScore * 100).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={Math.abs(item.sentimentScore) * 100} 
                      className={`h-2 ${item.sentimentScore >= 0 ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>24-Hour Sentiment Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-64 flex items-end gap-1">
                  {sentimentTrend.map((point, index) => (
                    <div
                      key={index}
                      className={`flex-1 ${point.sentiment >= 0 ? 'bg-green-500' : 'bg-red-500'} rounded-t`}
                      style={{ height: `${Math.abs(point.sentiment) * 100 + 20}px` }}
                      title={`Hour ${point.hour}: ${(point.sentiment * 100).toFixed(1)}%`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>24h ago</span>
                  <span>12h ago</span>
                  <span>Now</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fake-news" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fake News Detection Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newsItems.map((item) => (
                  <div key={item.id} className="p-4 border rounded">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{item.title}</h4>
                      <Badge 
                        variant={item.isFakeNews ? "destructive" : "default"}
                        className="ml-2"
                      >
                        {item.isFakeNews ? 'Likely Fake' : 'Verified'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Authenticity Confidence</span>
                        <span>{((1 - item.fakeNewsConfidence) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={(1 - item.fakeNewsConfidence) * 100}
                        className={`h-2 ${item.isFakeNews ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'}`}
                      />
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-2">
                      Source: {item.source} • {new Date(item.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsAnalytics;
