
import { NewsItem } from '@/types/trading';

interface NewsSource {
  id: string;
  name: string;
  url: string;
  apiKey?: string;
  isActive: boolean;
  rateLimit: number;
}

class NewsAggregatorService {
  private sources: NewsSource[] = [
    {
      id: 'cryptopanic',
      name: 'CryptoPanic',
      url: 'https://cryptopanic.com/api/v1/posts/',
      isActive: true,
      rateLimit: 100
    },
    {
      id: 'coindesk',
      name: 'CoinDesk',
      url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
      isActive: true,
      rateLimit: 50
    },
    {
      id: 'cointelegraph',
      name: 'CoinTelegraph',
      url: 'https://cointelegraph.com/rss',
      isActive: true,
      rateLimit: 50
    }
  ];

  async aggregateNews(limit: number = 20): Promise<NewsItem[]> {
    const allNews: NewsItem[] = [];

    for (const source of this.sources.filter(s => s.isActive)) {
      try {
        const news = await this.fetchFromSource(source, limit);
        allNews.push(...news);
      } catch (error) {
        console.error(`Error fetching from ${source.name}:`, error);
      }
    }

    // Sort by timestamp and deduplicate
    return this.deduplicateNews(allNews)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  private async fetchFromSource(source: NewsSource, limit: number): Promise<NewsItem[]> {
    switch (source.id) {
      case 'cryptopanic':
        return this.fetchFromCryptoPanic(limit);
      default:
        return this.generateMockNews(source.name, limit);
    }
  }

  private async fetchFromCryptoPanic(limit: number): Promise<NewsItem[]> {
    try {
      const response = await fetch(
        `https://cryptopanic.com/api/v1/posts/?auth_token=free&filter=hot&limit=${limit}`
      );
      
      if (!response.ok) throw new Error('CryptoPanic API error');
      
      const data = await response.json();
      return data.results.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        summary: item.title.slice(0, 200) + '...',
        url: item.url,
        source: 'CryptoPanic',
        publishedAt: item.published_at,
        sentiment: this.analyzeSentiment(item.title),
        relevance: Math.random() * 100,
        categories: item.currencies?.map((c: any) => c.code) || [],
        coins: item.currencies?.map((c: any) => c.code) || []
      }));
    } catch (error) {
      console.error('Error fetching from CryptoPanic:', error);
      return this.generateMockNews('CryptoPanic', limit);
    }
  }

  private generateMockNews(source: string, limit: number): NewsItem[] {
    const mockTitles = [
      'Bitcoin reaches new all-time high amid institutional adoption',
      'Ethereum 2.0 staking rewards surge as more validators join',
      'DeFi protocols see record TVL growth in Q4',
      'Central banks explore digital currency implementations',
      'Major exchange announces new security features',
      'Algorand partnership drives ecosystem expansion',
      'Regulatory clarity emerges for crypto assets',
      'NFT marketplace integration with traditional art galleries'
    ];

    return Array.from({ length: limit }, (_, i) => ({
      id: `${source}-${Date.now()}-${i}`,
      title: mockTitles[i % mockTitles.length],
      summary: `${mockTitles[i % mockTitles.length].slice(0, 100)}...`,
      url: `https://example.com/news/${i}`,
      source,
      publishedAt: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      sentiment: this.analyzeSentiment(mockTitles[i % mockTitles.length]),
      relevance: Math.random() * 100,
      categories: ['cryptocurrency', 'blockchain'],
      coins: ['BTC', 'ETH', 'ALGO'][Math.floor(Math.random() * 3)] ? ['BTC'] : []
    }));
  }

  private analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['high', 'surge', 'growth', 'adoption', 'partnership', 'expansion'];
    const negativeWords = ['crash', 'drop', 'hack', 'regulation', 'ban', 'decline'];
    
    const lowerText = text.toLowerCase();
    const hasPositive = positiveWords.some(word => lowerText.includes(word));
    const hasNegative = negativeWords.some(word => lowerText.includes(word));
    
    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  }

  private deduplicateNews(news: NewsItem[]): NewsItem[] {
    const seen = new Set();
    return news.filter(item => {
      const key = item.title.toLowerCase().slice(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async detectFakeNews(newsItems: NewsItem[]): Promise<NewsItem[]> {
    return newsItems.map(item => ({
      ...item,
      isFake: this.checkFakeNewsIndicators(item),
      confidence: Math.random() * 100
    }));
  }

  private checkFakeNewsIndicators(item: NewsItem): boolean {
    const suspiciousWords = ['URGENT', 'BREAKING', 'LEAKED', 'EXCLUSIVE', 'INSIDER'];
    const hasClickbait = suspiciousWords.some(word => 
      item.title.toUpperCase().includes(word)
    );
    
    const hasUnreliableSource = ['unknown', 'anonymous', 'insider'].some(word =>
      item.source.toLowerCase().includes(word)
    );
    
    return hasClickbait || hasUnreliableSource;
  }
}

export const newsAggregatorService = new NewsAggregatorService();
export default newsAggregatorService;
