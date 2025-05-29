
import { CoinOption, NewsItem } from '@/types/trading';

interface ApiProvider {
  name: string;
  baseUrl: string;
  endpoints: Record<string, string>;
  rateLimit: number;
  isActive: boolean;
  priority: number;
}

interface ExchangeRates {
  USD: number;
  AUD: number;
  EUR: number;
  GBP: number;
}

interface SocialSentiment {
  platform: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number;
  mentions: number;
  engagement: number;
}

interface OnChainMetrics {
  activeAddresses: number;
  transactionCount: number;
  hashRate?: number;
  networkValue: number;
  whaleMovements: Array<{
    amount: number;
    timestamp: string;
    direction: 'in' | 'out';
  }>;
}

class ComprehensiveApiService {
  private providers: Map<string, ApiProvider> = new Map();
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private defaultCurrency = 'aud';
  private exchangeRates: ExchangeRates = { USD: 1, AUD: 1.52, EUR: 0.85, GBP: 0.75 };

  constructor() {
    this.initializeProviders();
    this.startExchangeRateUpdates();
  }

  private initializeProviders() {
    const providers: ApiProvider[] = [
      // Market Data Providers
      {
        name: 'CoinGecko',
        baseUrl: 'https://api.coingecko.com/api/v3',
        endpoints: {
          coins: '/coins/markets',
          trending: '/search/trending',
          global: '/global',
          exchanges: '/exchanges',
          categories: '/coins/categories',
          onchain: '/coins/{id}/onchain_market_data'
        },
        rateLimit: 50,
        isActive: true,
        priority: 1
      },
      {
        name: 'CoinMarketCap',
        baseUrl: 'https://pro-api.coinmarketcap.com/v1',
        endpoints: {
          listings: '/cryptocurrency/listings/latest',
          quotes: '/cryptocurrency/quotes/latest',
          global: '/global-metrics/quotes/latest',
          categories: '/cryptocurrency/categories'
        },
        rateLimit: 30,
        isActive: false,
        priority: 2
      },
      {
        name: 'CryptoCompare',
        baseUrl: 'https://min-api.cryptocompare.com/data',
        endpoints: {
          price: '/pricemultifull',
          historical: '/histoday',
          news: '/v2/news/',
          social: '/social/coin/general',
          mining: '/mining/pools/general'
        },
        rateLimit: 100,
        isActive: true,
        priority: 1
      },
      {
        name: 'Messari',
        baseUrl: 'https://data.messari.io/api/v1',
        endpoints: {
          assets: '/assets',
          metrics: '/assets/{id}/metrics',
          news: '/news',
          onchain: '/assets/{id}/metrics/on-chain'
        },
        rateLimit: 20,
        isActive: true,
        priority: 2
      },
      {
        name: 'CoinCap',
        baseUrl: 'https://api.coincap.io/v2',
        endpoints: {
          assets: '/assets',
          markets: '/markets',
          exchanges: '/exchanges',
          candles: '/assets/{id}/candles'
        },
        rateLimit: 200,
        isActive: true,
        priority: 2
      },
      // News & Sentiment Providers
      {
        name: 'CryptoPanic',
        baseUrl: 'https://cryptopanic.com/api/v1',
        endpoints: {
          posts: '/posts',
          currencies: '/currencies'
        },
        rateLimit: 60,
        isActive: true,
        priority: 1
      },
      {
        name: 'Alternative.me',
        baseUrl: 'https://api.alternative.me',
        endpoints: {
          feargreed: '/fng',
          global: '/global'
        },
        rateLimit: 60,
        isActive: true,
        priority: 1
      },
      // Blockchain Explorers
      {
        name: 'Blockchain.info',
        baseUrl: 'https://blockchain.info',
        endpoints: {
          stats: '/stats',
          pools: '/pools',
          charts: '/charts',
          unconfirmed: '/unconfirmed-transactions',
          mempool: '/mempool'
        },
        rateLimit: 300,
        isActive: true,
        priority: 1
      },
      {
        name: 'Etherscan',
        baseUrl: 'https://api.etherscan.io/api',
        endpoints: {
          balance: '?module=account&action=balance',
          transactions: '?module=account&action=txlist',
          gasprice: '?module=gastracker&action=gasoracle',
          supply: '?module=stats&action=ethsupply'
        },
        rateLimit: 5,
        isActive: false,
        priority: 3
      },
      // DeFi Protocols
      {
        name: 'DeFiPulse',
        baseUrl: 'https://data-api.defipulse.com/api/v1',
        endpoints: {
          protocols: '/projects',
          tvl: '/projects/{id}/tvl'
        },
        rateLimit: 60,
        isActive: true,
        priority: 2
      },
      {
        name: 'Uniswap',
        baseUrl: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
        endpoints: {
          pools: '',
          tokens: '',
          positions: ''
        },
        rateLimit: 100,
        isActive: true,
        priority: 2
      },
      // Social Media APIs
      {
        name: 'Reddit',
        baseUrl: 'https://www.reddit.com',
        endpoints: {
          cryptocurrency: '/r/CryptoCurrency/hot.json',
          bitcoin: '/r/Bitcoin/hot.json',
          ethereum: '/r/ethereum/hot.json'
        },
        rateLimit: 60,
        isActive: true,
        priority: 2
      }
    ];

    providers.forEach(provider => {
      this.providers.set(provider.name, provider);
    });
  }

  private startExchangeRateUpdates() {
    // Update exchange rates every hour
    setInterval(() => {
      this.updateExchangeRates();
    }, 3600000);
    
    // Initial update
    this.updateExchangeRates();
  }

  private async updateExchangeRates() {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      this.exchangeRates = {
        USD: 1,
        AUD: data.rates.AUD || 1.52,
        EUR: data.rates.EUR || 0.85,
        GBP: data.rates.GBP || 0.75
      };
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
    }
  }

  async getComprehensiveMarketData(limit: number = 250): Promise<CoinOption[]> {
    const cacheKey = `comprehensive-market-data-${limit}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < 30000) { // 30 second cache
        return cached.data;
      }
    }

    const providers = [
      () => this.fetchFromCoinGecko(limit),
      () => this.fetchFromCryptoCompare(limit),
      () => this.fetchFromCoinCap(limit)
    ];

    let combinedData: CoinOption[] = [];

    for (const fetchFn of providers) {
      try {
        const data = await fetchFn();
        if (data && data.length > 0) {
          combinedData = this.mergeMarketData(combinedData, data);
        }
      } catch (error) {
        console.warn('Provider failed, trying next:', error);
      }
    }

    // Sort by market cap and limit results
    const finalData = combinedData
      .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))
      .slice(0, limit);

    this.cache.set(cacheKey, {
      data: finalData,
      timestamp: Date.now(),
      ttl: 30000
    });

    return finalData;
  }

  private mergeMarketData(existing: CoinOption[], newData: CoinOption[]): CoinOption[] {
    const merged = [...existing];
    
    newData.forEach(newCoin => {
      const existingIndex = merged.findIndex(coin => 
        coin.symbol === newCoin.symbol || coin.id === newCoin.id
      );
      
      if (existingIndex !== -1) {
        // Merge data, preferring more complete data
        merged[existingIndex] = {
          ...merged[existingIndex],
          ...newCoin,
          // Average prices if both exist
          price: (merged[existingIndex].price + newCoin.price) / 2
        };
      } else {
        merged.push(newCoin);
      }
    });
    
    return merged;
  }

  private async fetchFromCoinGecko(limit: number): Promise<CoinOption[]> {
    const provider = this.providers.get('CoinGecko')!;
    const response = await fetch(
      `${provider.baseUrl}${provider.endpoints.coins}?vs_currency=${this.defaultCurrency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d%2C30d`
    );

    if (!response.ok) throw new Error('CoinGecko API failed');

    const data = await response.json();
    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price || 0,
      priceChange: coin.price_change_24h || 0,
      changePercent: coin.price_change_percentage_24h || 0,
      volume: coin.total_volume || 0,
      marketCap: coin.market_cap || 0,
      rank: coin.market_cap_rank || 0,
      image: coin.image,
      value: coin.id,
      label: `${coin.name} (${coin.symbol.toUpperCase()})`,
      priceChange1h: coin.price_change_percentage_1h_in_currency || 0,
      priceChange7d: coin.price_change_percentage_7d_in_currency || 0,
      priceChange30d: coin.price_change_percentage_30d_in_currency || 0,
      circulatingSupply: coin.circulating_supply || 0,
      totalSupply: coin.total_supply || 0,
      maxSupply: coin.max_supply || 0
    }));
  }

  private async fetchFromCryptoCompare(limit: number): Promise<CoinOption[]> {
    const provider = this.providers.get('CryptoCompare')!;
    
    const topListResponse = await fetch(
      `${provider.baseUrl}/top/mktcapfull?limit=${limit}&tsym=${this.defaultCurrency.toUpperCase()}`
    );

    if (!topListResponse.ok) throw new Error('CryptoCompare API failed');

    const topListData = await topListResponse.json();
    
    if (!topListData.Data) {
      throw new Error('Invalid CryptoCompare response');
    }

    return topListData.Data.map((item: any, index: number) => {
      const coinInfo = item.CoinInfo;
      const audData = item.RAW?.[this.defaultCurrency.toUpperCase()];
      
      if (!audData) return null;

      return {
        id: coinInfo.Name.toLowerCase(),
        symbol: coinInfo.Name,
        name: coinInfo.FullName,
        price: audData.PRICE || 0,
        priceChange: audData.CHANGE24HOUR || 0,
        changePercent: audData.CHANGEPCT24HOUR || 0,
        volume: audData.VOLUME24HOUR || 0,
        marketCap: audData.MKTCAP || 0,
        rank: index + 1,
        image: `https://www.cryptocompare.com${coinInfo.ImageUrl}`,
        value: coinInfo.Name.toLowerCase(),
        label: `${coinInfo.FullName} (${coinInfo.Name})`
      };
    }).filter(Boolean);
  }

  private async fetchFromCoinCap(limit: number): Promise<CoinOption[]> {
    const provider = this.providers.get('CoinCap')!;
    const response = await fetch(`${provider.baseUrl}${provider.endpoints.assets}?limit=${limit}`);

    if (!response.ok) throw new Error('CoinCap API failed');

    const data = await response.json();
    
    return data.data.map((asset: any, index: number) => ({
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      price: (parseFloat(asset.priceUsd) || 0) * this.exchangeRates.AUD,
      priceChange: (parseFloat(asset.changePercent24Hr) || 0) * (parseFloat(asset.priceUsd) || 0) * this.exchangeRates.AUD / 100,
      changePercent: parseFloat(asset.changePercent24Hr) || 0,
      volume: (parseFloat(asset.volumeUsd24Hr) || 0) * this.exchangeRates.AUD,
      marketCap: (parseFloat(asset.marketCapUsd) || 0) * this.exchangeRates.AUD,
      rank: parseInt(asset.rank) || index + 1,
      image: `https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`,
      value: asset.id,
      label: `${asset.name} (${asset.symbol})`
    }));
  }

  async getSocialSentiment(symbols: string[]): Promise<Record<string, SocialSentiment[]>> {
    const sentiment: Record<string, SocialSentiment[]> = {};
    
    for (const symbol of symbols) {
      sentiment[symbol] = await this.fetchSocialSentimentForSymbol(symbol);
    }
    
    return sentiment;
  }

  private async fetchSocialSentimentForSymbol(symbol: string): Promise<SocialSentiment[]> {
    const sentiments: SocialSentiment[] = [];
    
    try {
      // Reddit sentiment
      const redditData = await this.fetchRedditSentiment(symbol);
      if (redditData) sentiments.push(redditData);
      
      // CryptoCompare social data
      const cryptoCompareSocial = await this.fetchCryptoCompareSocial(symbol);
      if (cryptoCompareSocial) sentiments.push(cryptoCompareSocial);
      
    } catch (error) {
      console.error(`Failed to fetch sentiment for ${symbol}:`, error);
    }
    
    return sentiments;
  }

  private async fetchRedditSentiment(symbol: string): Promise<SocialSentiment | null> {
    try {
      const response = await fetch('https://www.reddit.com/r/CryptoCurrency/search.json?q=' + symbol + '&sort=hot&limit=25');
      const data = await response.json();
      
      const posts = data.data?.children || [];
      const totalScore = posts.reduce((sum: number, post: any) => sum + (post.data.score || 0), 0);
      const avgScore = posts.length > 0 ? totalScore / posts.length : 0;
      
      return {
        platform: 'Reddit',
        sentiment: avgScore > 10 ? 'bullish' : avgScore < -5 ? 'bearish' : 'neutral',
        score: Math.max(-1, Math.min(1, avgScore / 100)),
        mentions: posts.length,
        engagement: totalScore
      };
    } catch (error) {
      console.error('Reddit sentiment fetch failed:', error);
      return null;
    }
  }

  private async fetchCryptoCompareSocial(symbol: string): Promise<SocialSentiment | null> {
    try {
      const response = await fetch(`https://min-api.cryptocompare.com/data/social/coin/general?fsym=${symbol}`);
      const data = await response.json();
      
      if (data.Data) {
        const socialData = data.Data;
        const sentiment = socialData.General?.PointsChange?.hour || 0;
        
        return {
          platform: 'CryptoCompare',
          sentiment: sentiment > 5 ? 'bullish' : sentiment < -5 ? 'bearish' : 'neutral',
          score: Math.max(-1, Math.min(1, sentiment / 100)),
          mentions: socialData.CommunityData?.Posts || 0,
          engagement: socialData.CommunityData?.Followers || 0
        };
      }
      
      return null;
    } catch (error) {
      console.error('CryptoCompare social fetch failed:', error);
      return null;
    }
  }

  async getOnChainMetrics(symbol: string): Promise<OnChainMetrics | null> {
    try {
      // For now, return mock data - in production, integrate with blockchain APIs
      return {
        activeAddresses: Math.floor(Math.random() * 1000000) + 100000,
        transactionCount: Math.floor(Math.random() * 500000) + 50000,
        hashRate: symbol === 'BTC' ? Math.floor(Math.random() * 200) + 150 : undefined,
        networkValue: Math.floor(Math.random() * 10000000000) + 1000000000,
        whaleMovements: [
          {
            amount: Math.floor(Math.random() * 1000) + 100,
            timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
            direction: Math.random() > 0.5 ? 'in' : 'out'
          }
        ]
      };
    } catch (error) {
      console.error(`Failed to fetch on-chain metrics for ${symbol}:`, error);
      return null;
    }
  }

  async getFearGreedIndex(): Promise<number> {
    try {
      const response = await fetch('https://api.alternative.me/fng/');
      const data = await response.json();
      return parseInt(data.data[0]?.value) || 50;
    } catch (error) {
      console.error('Failed to fetch Fear & Greed Index:', error);
      return 50;
    }
  }

  async getCryptoNews(limit: number = 50): Promise<NewsItem[]> {
    const cacheKey = `comprehensive-news-${limit}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < 300000) { // 5 minute cache
        return cached.data;
      }
    }

    const newsSources = [
      () => this.fetchNewsFromCryptoPanic(limit),
      () => this.fetchNewsFromCryptoCompare(limit),
      () => this.fetchNewsFromReddit(limit),
      () => this.fetchNewsFromMessari(limit)
    ];

    let allNews: NewsItem[] = [];

    for (const fetchNews of newsSources) {
      try {
        const news = await fetchNews();
        allNews = [...allNews, ...news];
      } catch (error) {
        console.warn('News source failed:', error);
      }
    }

    const uniqueNews = allNews
      .filter((news, index, self) => 
        index === self.findIndex(n => n.title === news.title)
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    this.cache.set(cacheKey, {
      data: uniqueNews,
      timestamp: Date.now(),
      ttl: 300000
    });

    return uniqueNews;
  }

  private async fetchNewsFromCryptoPanic(limit: number): Promise<NewsItem[]> {
    try {
      const response = await fetch(
        `https://cryptopanic.com/api/v1/posts/?auth_token=free&filter=hot&limit=${limit}`
      );
      const data = await response.json();
      
      return data.results?.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        summary: item.title,
        url: item.url,
        source: item.source?.title || 'CryptoPanic',
        publishedAt: item.published_at,
        timestamp: item.published_at,
        sentiment: item.votes?.positive > item.votes?.negative ? 'positive' : 'neutral',
        relevance: Math.min((item.votes?.positive || 0) / 10, 1),
        categories: item.currencies?.map((c: any) => c.code) || []
      })) || [];
    } catch (error) {
      console.error('Failed to fetch from CryptoPanic:', error);
      return [];
    }
  }

  private async fetchNewsFromCryptoCompare(limit: number): Promise<NewsItem[]> {
    try {
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest&limit=${limit}`
      );
      const data = await response.json();
      
      return data.Data?.map((item: any) => ({
        id: item.id,
        title: item.title,
        summary: item.body.substring(0, 200) + '...',
        url: item.url,
        source: item.source_info?.name || 'CryptoCompare',
        publishedAt: new Date(item.published_on * 1000).toISOString(),
        timestamp: new Date(item.published_on * 1000).toISOString(),
        sentiment: 'neutral',
        relevance: 0.8,
        categories: item.categories?.split('|') || []
      })) || [];
    } catch (error) {
      console.error('Failed to fetch from CryptoCompare:', error);
      return [];
    }
  }

  private async fetchNewsFromReddit(limit: number): Promise<NewsItem[]> {
    try {
      const response = await fetch(
        `https://www.reddit.com/r/CryptoCurrency/hot.json?limit=${Math.min(limit, 25)}`
      );
      const data = await response.json();
      
      return data.data?.children?.map((post: any) => ({
        id: post.data.id,
        title: post.data.title,
        summary: post.data.selftext?.substring(0, 200) + '...' || post.data.title,
        url: `https://reddit.com${post.data.permalink}`,
        source: 'Reddit r/CryptoCurrency',
        publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
        timestamp: new Date(post.data.created_utc * 1000).toISOString(),
        sentiment: post.data.score > 100 ? 'positive' : 'neutral',
        relevance: Math.min(post.data.score / 1000, 1),
        categories: ['reddit', 'discussion']
      })) || [];
    } catch (error) {
      console.error('Failed to fetch from Reddit:', error);
      return [];
    }
  }

  private async fetchNewsFromMessari(limit: number): Promise<NewsItem[]> {
    try {
      const response = await fetch(`https://data.messari.io/api/v1/news?limit=${limit}`);
      const data = await response.json();
      
      return data.data?.map((item: any) => ({
        id: item.id,
        title: item.title,
        summary: item.content?.substring(0, 200) + '...' || item.title,
        url: item.url,
        source: 'Messari',
        publishedAt: item.published_at,
        timestamp: item.published_at,
        sentiment: 'neutral',
        relevance: 0.9,
        categories: item.tags || []
      })) || [];
    } catch (error) {
      console.error('Failed to fetch from Messari:', error);
      return [];
    }
  }

  convertCurrency(amount: number, from: string, to: string): number {
    const fromRate = this.exchangeRates[from.toUpperCase() as keyof ExchangeRates] || 1;
    const toRate = this.exchangeRates[to.toUpperCase() as keyof ExchangeRates] || 1;
    return (amount / fromRate) * toRate;
  }

  setDefaultCurrency(currency: string) {
    this.defaultCurrency = currency.toLowerCase();
  }

  getDefaultCurrency(): string {
    return this.defaultCurrency;
  }

  getExchangeRates(): ExchangeRates {
    return this.exchangeRates;
  }

  clearCache() {
    this.cache.clear();
  }

  getProviderStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    this.providers.forEach((provider, name) => {
      status[name] = provider.isActive;
    });
    return status;
  }
}

export const comprehensiveApiService = new ComprehensiveApiService();
export default comprehensiveApiService;
