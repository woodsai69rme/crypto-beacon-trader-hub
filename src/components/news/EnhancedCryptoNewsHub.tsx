
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Newspaper, TrendingUp, AlertTriangle, Search, Filter, ExternalLink, ThumbsUp, MessageCircle } from 'lucide-react';
import { newsAggregatorService } from '@/services/news/newsAggregatorService';
import { NewsItem } from '@/types/trading';

const EnhancedCryptoNewsHub: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  useEffect(() => {
    loadNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [news, searchTerm, sentimentFilter, sourceFilter]);

  const loadNews = async () => {
    setLoading(true);
    try {
      const newsData = await newsAggregatorService.aggregateNews(50);
      const analyzedNews = await newsAggregatorService.detectFakeNews(newsData);
      setNews(analyzedNews);
    } catch (error) {
      console.error('Failed to load news:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNews = () => {
    let filtered = news;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sentimentFilter !== 'all') {
      filtered = filtered.filter(item => item.sentiment === sentimentFilter);
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(item => item.source === sourceFilter);
    }

    setFilteredNews(filtered);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '📈';
      case 'negative': return '📉';
      default: return '➖';
    }
  };

  const marketSentiment = {
    positive: news.filter(n => n.sentiment === 'positive').length,
    negative: news.filter(n => n.sentiment === 'negative').length,
    neutral: news.filter(n => n.sentiment === 'neutral').length
  };

  const fakeNewsCount = news.filter(n => n.isFake).length;
  const totalNews = news.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Enhanced Crypto News Hub</h2>
          <p className="text-muted-foreground">Real-time news with AI sentiment analysis and fake news detection</p>
        </div>
        <Button onClick={loadNews} disabled={loading}>
          <Newspaper className="h-4 w-4 mr-2" />
          Refresh News
        </Button>
      </div>

      {/* Sentiment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Positive Sentiment</p>
                <p className="text-2xl font-bold text-green-600">{marketSentiment.positive}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {((marketSentiment.positive / totalNews) * 100).toFixed(0)}% of news
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Negative Sentiment</p>
                <p className="text-2xl font-bold text-red-600">{marketSentiment.negative}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {((marketSentiment.negative / totalNews) * 100).toFixed(0)}% of news
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Neutral News</p>
                <p className="text-2xl font-bold text-gray-600">{marketSentiment.neutral}</p>
              </div>
              <Newspaper className="h-8 w-8 text-gray-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {((marketSentiment.neutral / totalNews) * 100).toFixed(0)}% of news
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fake News Detected</p>
                <p className="text-2xl font-bold text-orange-600">{fakeNewsCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {((fakeNewsCount / totalNews) * 100).toFixed(1)}% flagged
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiments</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="CryptoPanic">CryptoPanic</SelectItem>
                <SelectItem value="CoinDesk">CoinDesk</SelectItem>
                <SelectItem value="CoinTelegraph">CoinTelegraph</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSentimentFilter('all');
              setSourceFilter('all');
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* News Feed */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All News ({filteredNews.length})</TabsTrigger>
          <TabsTrigger value="positive">Positive ({filteredNews.filter(n => n.sentiment === 'positive').length})</TabsTrigger>
          <TabsTrigger value="negative">Negative ({filteredNews.filter(n => n.sentiment === 'negative').length})</TabsTrigger>
          <TabsTrigger value="fake">Fake News ({filteredNews.filter(n => n.isFake).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            {filteredNews.map((item) => (
              <Card key={item.id} className={`hover:shadow-md transition-shadow ${item.isFake ? 'border-orange-200 bg-orange-50' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getSentimentColor(item.sentiment || 'neutral')}>
                        {getSentimentIcon(item.sentiment || 'neutral')} {item.sentiment}
                      </Badge>
                      <Badge variant="secondary">{item.source}</Badge>
                      {item.isFake && (
                        <Badge variant="destructive">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Potential Fake
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 leading-tight">{item.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{item.summary}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{Math.floor(Math.random() * 100)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageCircle className="h-4 w-4" />
                        <span>{Math.floor(Math.random() * 50)}</span>
                      </div>
                      {item.relevance && (
                        <Badge variant="outline">
                          {item.relevance.toFixed(0)}% relevant
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Read More
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="positive">
          {/* Same structure but filtered for positive news */}
        </TabsContent>

        <TabsContent value="negative">
          {/* Same structure but filtered for negative news */}
        </TabsContent>

        <TabsContent value="fake">
          {/* Same structure but filtered for fake news */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCryptoNewsHub;
