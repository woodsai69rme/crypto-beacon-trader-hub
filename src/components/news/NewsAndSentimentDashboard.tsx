
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Newspaper, TrendingUp, TrendingDown, RefreshCw, AlertTriangle } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  source: string;
  timestamp: Date;
  isFakeNews: boolean;
}

const NewsAndSentimentDashboard: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [marketSentiment, setMarketSentiment] = useState({
    overall: 'neutral' as 'positive' | 'negative' | 'neutral',
    score: 65,
    trend: 'up' as 'up' | 'down'
  });

  useEffect(() => {
    generateMockNews();
  }, []);

  const generateMockNews = () => {
    const mockNews: NewsItem[] = [
      {
        id: '1',
        title: 'Bitcoin Reaches New Support Level at $65,000 AUD',
        summary: 'Bitcoin has established strong support at the $65,000 AUD level, with analysts predicting continued bullish momentum.',
        sentiment: 'positive',
        score: 85,
        source: 'CryptoNews AU',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isFakeNews: false
      },
      {
        id: '2',
        title: 'Ethereum 2.0 Staking Rewards Increase to 5.2%',
        summary: 'Ethereum staking rewards have increased as network participation grows, offering attractive yields for long-term holders.',
        sentiment: 'positive',
        score: 78,
        source: 'DeFi Today',
        timestamp: new Date(Date.now() - 1000 * 60 * 90),
        isFakeNews: false
      },
      {
        id: '3',
        title: 'FAKE: Central Bank to Ban All Crypto Trading',
        summary: 'This false story claims the RBA will ban cryptocurrency trading. Our AI detected this as fake news.',
        sentiment: 'negative',
        score: 15,
        source: 'Unknown Source',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        isFakeNews: true
      }
    ];

    setNewsItems(mockNews);
  };

  const refreshNews = () => {
    setLoading(true);
    setTimeout(() => {
      generateMockNews();
      setLoading(false);
    }, 1000);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4" />;
      case 'negative': return <TrendingDown className="h-4 w-4" />;
      default: return <Newspaper className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">News & Sentiment Analysis</h2>
          <p className="text-muted-foreground">AI-powered news aggregation with fake news detection</p>
        </div>
        <Button variant="outline" size="sm" onClick={refreshNews} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Market Sentiment</p>
                <p className="text-2xl font-bold capitalize">{marketSentiment.overall}</p>
              </div>
              <div className={getSentimentColor(marketSentiment.overall)}>
                {getSentimentIcon(marketSentiment.overall)}
              </div>
            </div>
            <Progress value={marketSentiment.score} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-2">{marketSentiment.score}% positive</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">News Sources</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Newspaper className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Active feeds monitored</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fake News Detected</p>
                <p className="text-2xl font-bold text-red-600">1</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">AI-powered detection</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest News</CardTitle>
          <CardDescription>Real-time crypto news with sentiment analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {newsItems.map(item => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{item.title}</h4>
                      {item.isFakeNews && (
                        <Badge variant="destructive" className="text-xs">
                          Fake News
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.summary}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{item.source}</span>
                      <span>{item.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className={`flex items-center gap-1 ${getSentimentColor(item.sentiment)}`}>
                      {getSentimentIcon(item.sentiment)}
                      <span className="text-sm font-medium">{item.score}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsAndSentimentDashboard;
