
import { apiProviderManager } from './apiProviderManager';
import { CoinOption, NewsItem } from '@/types/trading';

class EnhancedDataService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  async fetchWithFallback<T>(
    fetchFunctions: Array<() => Promise<T>>,
    cacheKey?: string,
    cacheTtl = 300000 // 5 minutes
  ): Promise<T | null> {
    // Check cache first
    if (cacheKey && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < cached.ttl) {
        return cached.data;
      }
    }

    // Try each fetch function in order
    for (const fetchFn of fetchFunctions) {
      try {
        const result = await fetchFn();
        
        // Cache successful result
        if (cacheKey && result) {
          this.cache.set(cacheKey, {
            data: result,
            timestamp: Date.now(),
            ttl: cacheTtl
          });
        }
        
        return result;
      } catch (error) {
        console.warn('Fetch function failed, trying next:', error);
        continue;
      }
    }

    return null;
  }

  async getMarketData(symbols: string[] = ['bitcoin', 'ethereum']): Promise<CoinOption[]> {
    const fetchFunctions = [
      () => this.fetchFromCoinGecko(symbols),
      () => this.fetchFromCryptoCompare(symbols),
      () => this.fetchFromCoinMarketCap(symbols)
    ];

    const result = await this.fetchWithFallback(
      fetchFunctions,
      `market-data-${symbols.join(',')}`,
      60000 // 1 minute cache
    );

    return result || [];
  }

  async getFearGreedIndex(): Promise<{ value: number; classification: string }> {
    try {
      const response = await fetch('https://api.alternative.me/fng/');
      const data = await response.json();
      
      const latest = data.data[0];
      return {
        value: parseInt(latest.value),
        classification: latest.value_classification
      };
    } catch (error) {
      console.error('Failed to fetch Fear & Greed Index:', error);
      return { value: 50, classification: 'Neutral' };
    }
  }

  async getCryptoNews(): Promise<NewsItem[]> {
    const fetchFunctions = [
      () => this.fetchNewsFromCryptoPanic(),
      () => this.fetchNewsFromCoinTelegraph(),
      () => this.fetchNewsFromReddit()
    ];

    const result = await this.fetchWithFallback(
      fetchFunctions,
      'crypto-news',
      300000 // 5 minutes cache
    );

    return result || [];
  }

  private async fetchFromCoinGecko(symbols: string[]): Promise<CoinOption[]> {
    const provider = apiProviderManager.getProvider('coingecko');
    if (!provider) throw new Error('CoinGecko provider not found');

    const ids = symbols.join(',');
    const response = await fetch(
      `${provider.url}/coins/markets?ids=${ids}&vs_currency=aud&order=market_cap_desc&per_page=100&page=1`
    );

    if (!response.ok) throw new Error('CoinGecko API failed');

    const data = await response.json();
    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      priceChange: coin.price_change_24h,
      changePercent: coin.price_change_percentage_24h,
      volume: coin.total_volume,
      marketCap: coin.market_cap,
      image: coin.image,
      value: coin.id,
      label: `${coin.name} (${coin.symbol.toUpperCase()})`
    }));
  }

  private async fetchFromCryptoCompare(symbols: string[]): Promise<CoinOption[]> {
    const provider = apiProviderManager.getProvider('cryptocompare');
    if (!provider) throw new Error('CryptoCompare provider not found');

    const fsyms = symbols.map(s => s.toUpperCase()).join(',');
    const response = await fetch(
      `${provider.url}/pricemultifull?fsyms=${fsyms}&tsyms=AUD`
    );

    if (!response.ok) throw new Error('CryptoCompare API failed');

    const data = await response.json();
    return Object.keys(data.RAW).map(symbol => {
      const coinData = data.RAW[symbol].AUD;
      return {
        id: symbol.toLowerCase(),
        symbol: symbol,
        name: coinData.FROMSYMBOL,
        price: coinData.PRICE,
        priceChange: coinData.CHANGE24HOUR,
        changePercent: coinData.CHANGEPCT24HOUR,
        volume: coinData.VOLUME24HOUR,
        marketCap: coinData.MKTCAP,
        image: `https://www.cryptocompare.com${coinData.IMAGEURL}`,
        value: symbol.toLowerCase(),
        label: `${coinData.FROMSYMBOL} (${symbol})`
      };
    });
  }

  private async fetchFromCoinMarketCap(symbols: string[]): Promise<CoinOption[]> {
    // This would require API key - placeholder implementation
    console.log('CoinMarketCap fetch would require API key');
    return [];
  }

  private async fetchNewsFromCryptoPanic(): Promise<NewsItem[]> {
    try {
      const response = await fetch('https://cryptopanic.com/api/v1/posts/?auth_token=free&filter=hot');
      const data = await response.json();
      
      return data.results.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        summary: item.title,
        url: item.url,
        source: item.source?.title || 'CryptoPanic',
        publishedAt: item.published_at,
        timestamp: item.published_at,
        sentiment: item.votes?.positive > item.votes?.negative ? 'positive' : 'neutral',
        relevance: 0.8,
        categories: item.currencies?.map((c: any) => c.code) || []
      }));
    } catch (error) {
      console.error('Failed to fetch from CryptoPanic:', error);
      return [];
    }
  }

  private async fetchNewsFromCoinTelegraph(): Promise<NewsItem[]> {
    // Mock implementation - would need actual API integration
    return [];
  }

  private async fetchNewsFromReddit(): Promise<NewsItem[]> {
    try {
      const response = await fetch('https://www.reddit.com/r/CryptoCurrency/hot.json?limit=10');
      const data = await response.json();
      
      return data.data.children.map((post: any) => ({
        id: post.data.id,
        title: post.data.title,
        summary: post.data.selftext || post.data.title,
        url: `https://reddit.com${post.data.permalink}`,
        source: 'Reddit',
        publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
        timestamp: new Date(post.data.created_utc * 1000).toISOString(),
        sentiment: post.data.score > 100 ? 'positive' : 'neutral',
        relevance: Math.min(post.data.score / 1000, 1),
        categories: ['reddit', 'discussion']
      }));
    } catch (error) {
      console.error('Failed to fetch from Reddit:', error);
      return [];
    }
  }

  async getSentimentAnalysis(text: string): Promise<{ sentiment: string; score: number }> {
    // This would integrate with OpenRouter for sentiment analysis
    // For now, return mock data
    const positiveWords = ['bullish', 'moon', 'pump', 'buy', 'hodl', 'gain'];
    const negativeWords = ['bearish', 'dump', 'sell', 'crash', 'loss', 'fear'];
    
    const words = text.toLowerCase().split(' ');
    let score = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });
    
    const normalizedScore = Math.max(-1, Math.min(1, score / words.length * 10));
    
    return {
      sentiment: normalizedScore > 0.1 ? 'positive' : normalizedScore < -0.1 ? 'negative' : 'neutral',
      score: normalizedScore
    };
  }
}

export const enhancedDataService = new EnhancedDataService();
