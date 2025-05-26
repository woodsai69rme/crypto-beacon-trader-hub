
import { CoinOption, NewsItem } from '@/types/trading';

interface ApiProvider {
  name: string;
  baseUrl: string;
  endpoints: Record<string, string>;
  rateLimit: number;
  isActive: boolean;
}

interface MarketMetrics {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  ethDominance: number;
  fearGreedIndex: number;
  activeCoins: number;
}

class FreeApiIntegrationService {
  private providers: Map<string, ApiProvider> = new Map();
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private defaultCurrency = 'aud';

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    const providers: ApiProvider[] = [
      {
        name: 'CoinGecko',
        baseUrl: 'https://api.coingecko.com/api/v3',
        endpoints: {
          coins: '/coins/markets',
          trending: '/search/trending',
          global: '/global',
          exchanges: '/exchanges',
          categories: '/coins/categories'
        },
        rateLimit: 50,
        isActive: true
      },
      {
        name: 'CoinMarketCap',
        baseUrl: 'https://pro-api.coinmarketcap.com/v1',
        endpoints: {
          listings: '/cryptocurrency/listings/latest',
          quotes: '/cryptocurrency/quotes/latest',
          global: '/global-metrics/quotes/latest'
        },
        rateLimit: 30,
        isActive: false // Requires API key
      },
      {
        name: 'CryptoCompare',
        baseUrl: 'https://min-api.cryptocompare.com/data',
        endpoints: {
          price: '/pricemultifull',
          historical: '/histoday',
          news: '/v2/news/',
          social: '/social/coin/general'
        },
        rateLimit: 100,
        isActive: true
      },
      {
        name: 'Messari',
        baseUrl: 'https://data.messari.io/api/v1',
        endpoints: {
          assets: '/assets',
          metrics: '/assets/{id}/metrics',
          news: '/news'
        },
        rateLimit: 20,
        isActive: true
      },
      {
        name: 'CryptoPanic',
        baseUrl: 'https://cryptopanic.com/api/v1',
        endpoints: {
          posts: '/posts',
          currencies: '/currencies'
        },
        rateLimit: 60,
        isActive: true
      },
      {
        name: 'Alternative.me',
        baseUrl: 'https://api.alternative.me',
        endpoints: {
          feargreed: '/fng',
          global: '/global'
        },
        rateLimit: 60,
        isActive: true
      },
      {
        name: 'Blockchain.info',
        baseUrl: 'https://blockchain.info',
        endpoints: {
          stats: '/stats',
          pools: '/pools',
          charts: '/charts'
        },
        rateLimit: 300,
        isActive: true
      },
      {
        name: 'Etherscan',
        baseUrl: 'https://api.etherscan.io/api',
        endpoints: {
          balance: '?module=account&action=balance',
          transactions: '?module=account&action=txlist',
          gasprice: '?module=gastracker&action=gasoracle'
        },
        rateLimit: 5,
        isActive: false // Requires API key
      }
    ];

    providers.forEach(provider => {
      this.providers.set(provider.name, provider);
    });
  }

  async getComprehensiveMarketData(limit: number = 250): Promise<CoinOption[]> {
    const cacheKey = `market-data-${limit}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < 60000) { // 1 minute cache
        return cached.data;
      }
    }

    const fetchFunctions = [
      () => this.fetchFromCoinGecko(limit),
      () => this.fetchFromCryptoCompare(limit),
      () => this.fetchFromMessari(limit)
    ];

    for (const fetchFn of fetchFunctions) {
      try {
        const data = await fetchFn();
        if (data && data.length > 0) {
          this.cache.set(cacheKey, {
            data,
            timestamp: Date.now(),
            ttl: 60000
          });
          return data;
        }
      } catch (error) {
        console.warn('API fetch failed, trying next provider:', error);
      }
    }

    return [];
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
    
    // Get top coins list first
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
      
      if (!audData) {
        return null;
      }

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

  private async fetchFromMessari(limit: number): Promise<CoinOption[]> {
    const provider = this.providers.get('Messari')!;
    const response = await fetch(
      `${provider.baseUrl}${provider.endpoints.assets}?limit=${limit}&fields=id,symbol,name,slug,metrics/market_data/price_usd,metrics/market_data/volume_last_24_hours,metrics/market_data/percent_change_usd_last_24_hours,metrics/marketcap/current_marketcap_usd`
    );

    if (!response.ok) throw new Error('Messari API failed');

    const data = await response.json();
    
    if (!data.data) {
      throw new Error('Invalid Messari response');
    }

    // Convert USD to AUD (mock conversion rate - in production use real exchange rate API)
    const usdToAud = 1.52; // Mock rate

    return data.data.map((asset: any, index: number) => {
      const metrics = asset.metrics;
      const marketData = metrics?.market_data || {};
      const marketcap = metrics?.marketcap || {};

      return {
        id: asset.slug,
        symbol: asset.symbol,
        name: asset.name,
        price: (marketData.price_usd || 0) * usdToAud,
        priceChange: ((marketData.percent_change_usd_last_24_hours || 0) / 100) * (marketData.price_usd || 0) * usdToAud,
        changePercent: marketData.percent_change_usd_last_24_hours || 0,
        volume: (marketData.volume_last_24_hours || 0) * usdToAud,
        marketCap: (marketcap.current_marketcap_usd || 0) * usdToAud,
        rank: index + 1,
        image: `https://messari.io/asset-images/${asset.id}/32.png`,
        value: asset.slug,
        label: `${asset.name} (${asset.symbol})`
      };
    });
  }

  async getGlobalMarketMetrics(): Promise<MarketMetrics> {
    const cacheKey = 'global-metrics';
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < 300000) { // 5 minute cache
        return cached.data;
      }
    }

    try {
      // Try CoinGecko global endpoint first
      const response = await fetch('https://api.coingecko.com/api/v3/global');
      const data = await response.json();
      
      const globalData = data.data;
      const usdToAud = 1.52; // Mock conversion rate

      const metrics: MarketMetrics = {
        totalMarketCap: (globalData.total_market_cap?.usd || 0) * usdToAud,
        totalVolume24h: (globalData.total_volume?.usd || 0) * usdToAud,
        btcDominance: globalData.market_cap_percentage?.btc || 0,
        ethDominance: globalData.market_cap_percentage?.eth || 0,
        fearGreedIndex: await this.getFearGreedIndex(),
        activeCoins: globalData.active_cryptocurrencies || 0
      };

      this.cache.set(cacheKey, {
        data: metrics,
        timestamp: Date.now(),
        ttl: 300000
      });

      return metrics;
    } catch (error) {
      console.error('Failed to fetch global metrics:', error);
      return {
        totalMarketCap: 0,
        totalVolume24h: 0,
        btcDominance: 0,
        ethDominance: 0,
        fearGreedIndex: 50,
        activeCoins: 0
      };
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
    const cacheKey = `crypto-news-${limit}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < 600000) { // 10 minute cache
        return cached.data;
      }
    }

    const newsSources = [
      () => this.fetchNewsFromCryptoPanic(limit),
      () => this.fetchNewsFromCryptoCompare(limit),
      () => this.fetchNewsFromReddit(limit)
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

    // Remove duplicates and sort by timestamp
    const uniqueNews = allNews
      .filter((news, index, self) => 
        index === self.findIndex(n => n.title === news.title)
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    this.cache.set(cacheKey, {
      data: uniqueNews,
      timestamp: Date.now(),
      ttl: 600000
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

  async getTrendingCoins(): Promise<CoinOption[]> {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
      const data = await response.json();
      
      const trendingItems = data.coins || [];
      
      return trendingItems.map((item: any, index: number) => ({
        id: item.item.id,
        symbol: item.item.symbol,
        name: item.item.name,
        price: 0, // Trending endpoint doesn't include price
        priceChange: 0,
        changePercent: 0,
        volume: 0,
        marketCap: 0,
        rank: index + 1,
        image: item.item.large,
        value: item.item.id,
        label: `${item.item.name} (${item.item.symbol})`,
        isTrending: true
      }));
    } catch (error) {
      console.error('Failed to fetch trending coins:', error);
      return [];
    }
  }

  setDefaultCurrency(currency: string) {
    this.defaultCurrency = currency.toLowerCase();
  }

  getDefaultCurrency(): string {
    return this.defaultCurrency;
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

export const freeApiIntegrationService = new FreeApiIntegrationService();
export default freeApiIntegrationService;
