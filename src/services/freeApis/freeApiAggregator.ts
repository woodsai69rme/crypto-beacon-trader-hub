
// Enhanced Free API aggregator service combining multiple free crypto data sources
import { algorandService } from '@/services/algorand/algorandService';
import { CoinOption, NewsItem, ApiProvider } from '@/types/trading';

interface FreeApiProvider extends ApiProvider {
  priority: number;
  lastUsed?: string;
  errorCount: number;
}

interface MarketOverview {
  totalMarketCap: number;
  totalVolume: number;
  topCoins: CoinOption[];
  btcDominance: number;
  lastUpdated: string;
  fearGreedIndex?: number;
  activeCoins?: number;
}

class FreeApiAggregator {
  private providers: FreeApiProvider[] = [
    {
      id: 'coingecko-free',
      name: 'CoinGecko Free',
      type: 'free',
      url: 'https://api.coingecko.com/api/v3',
      baseUrl: 'https://api.coingecko.com/api/v3',
      documentation: 'https://www.coingecko.com/api/documentation',
      priority: 1,
      errorCount: 0,
      rateLimit: { requestsPerMinute: 30, requestsPerDay: 1000 },
      endpoints: {
        price: '/simple/price',
        markets: '/coins/markets',
        assets: '/coins/list'
      },
      isActive: true
    },
    {
      id: 'cryptocompare-free',
      name: 'CryptoCompare Free',
      type: 'free',
      url: 'https://min-api.cryptocompare.com/data',
      baseUrl: 'https://min-api.cryptocompare.com/data',
      documentation: 'https://min-api.cryptocompare.com/documentation',
      priority: 2,
      errorCount: 0,
      rateLimit: { requestsPerMinute: 100, requestsPerDay: 2000 },
      endpoints: {
        price: '/price',
        markets: '/top/mktcapfull',
        assets: '/all/coinlist',
        news: '/v2/news'
      },
      isActive: true
    },
    {
      id: 'coincap',
      name: 'CoinCap',
      type: 'free',
      url: 'https://api.coincap.io/v2',
      baseUrl: 'https://api.coincap.io/v2',
      documentation: 'https://docs.coincap.io/',
      priority: 3,
      errorCount: 0,
      rateLimit: { requestsPerMinute: 1000, requestsPerDay: 50000 },
      endpoints: {
        price: '/assets',
        markets: '/assets',
        assets: '/assets'
      },
      isActive: true
    },
    {
      id: 'algorand-nodely',
      name: 'Algorand (Nodely)',
      type: 'free',
      url: 'https://mainnet-api.4160.nodely.io',
      baseUrl: 'https://mainnet-api.4160.nodely.io',
      documentation: 'https://mainnet-idx.4160.nodely.dev/x2/api-docs/',
      priority: 4,
      errorCount: 0,
      rateLimit: { requestsPerMinute: 1000, requestsPerDay: 10000 },
      endpoints: {
        price: '/v2/status',
        markets: '/v2/accounts',
        assets: '/v2/assets'
      },
      isActive: true
    }
  ];

  private audConversionRate = 1.52; // Approximate USD to AUD conversion

  async getPriceData(symbols: string[] = ['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot']): Promise<CoinOption[]> {
    console.log('Fetching price data for symbols:', symbols);
    
    // Try providers in priority order
    for (const provider of this.providers.filter(p => p.isActive).sort((a, b) => a.priority - b.priority)) {
      try {
        const data = await this.fetchFromProvider(provider, symbols);
        if (data && data.length > 0) {
          provider.errorCount = 0;
          provider.lastUsed = new Date().toISOString();
          return data;
        }
      } catch (error) {
        console.error(`Error fetching from ${provider.name}:`, error);
        provider.errorCount++;
        if (provider.errorCount >= 3) {
          provider.isActive = false;
          console.warn(`Disabling provider ${provider.name} due to repeated errors`);
        }
      }
    }

    console.warn('All providers failed, returning mock data');
    return this.getMockPriceData();
  }

  private async fetchFromProvider(provider: FreeApiProvider, symbols: string[]): Promise<CoinOption[]> {
    switch (provider.id) {
      case 'coingecko-free':
        return this.fetchCoinGeckoData(symbols);
      case 'cryptocompare-free':
        return this.fetchCryptoCompareData(symbols);
      case 'coincap':
        return this.fetchCoinCapData(symbols);
      default:
        throw new Error(`Unsupported provider: ${provider.id}`);
    }
  }

  private async fetchCoinGeckoData(symbols: string[]): Promise<CoinOption[]> {
    const coinGeckoUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${symbols.join(',')}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`;
    
    const response = await fetch(coinGeckoUrl);
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price * this.audConversionRate,
      priceChange: coin.price_change_24h * this.audConversionRate,
      changePercent: coin.price_change_percentage_24h,
      marketCap: coin.market_cap * this.audConversionRate,
      volume: coin.total_volume * this.audConversionRate,
      image: coin.image,
      value: coin.id,
      label: `${coin.name} (${coin.symbol.toUpperCase()})`,
      rank: coin.market_cap_rank
    }));
  }

  private async fetchCryptoCompareData(symbols: string[]): Promise<CoinOption[]> {
    const symbolsUpper = symbols.map(s => s.toUpperCase());
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbolsUpper.join(',')}&tsyms=USD`
    );
    
    if (!response.ok) {
      throw new Error(`CryptoCompare API error: ${response.status}`);
    }
    
    const data = await response.json();
    const raw = data.RAW;
    const display = data.DISPLAY;
    
    return symbolsUpper.map(symbol => {
      const rawData = raw[symbol]?.USD;
      const displayData = display[symbol]?.USD;
      
      if (!rawData) return null;
      
      return {
        id: symbol.toLowerCase(),
        name: rawData.FROMSYMBOL,
        symbol: symbol,
        price: rawData.PRICE * this.audConversionRate,
        priceChange: rawData.CHANGE24HOUR * this.audConversionRate,
        changePercent: rawData.CHANGEPCT24HOUR,
        marketCap: rawData.MKTCAP * this.audConversionRate,
        volume: rawData.VOLUME24HOURTO * this.audConversionRate,
        value: symbol.toLowerCase(),
        label: `${rawData.FROMSYMBOL} (${symbol})`,
        rank: 0
      };
    }).filter(Boolean) as CoinOption[];
  }

  private async fetchCoinCapData(symbols: string[]): Promise<CoinOption[]> {
    const response = await fetch('https://api.coincap.io/v2/assets?limit=50');
    if (!response.ok) {
      throw new Error(`CoinCap API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data.slice(0, 20).map((coin: any, index: number) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: parseFloat(coin.priceUsd) * this.audConversionRate,
      priceChange: parseFloat(coin.changePercent24Hr) * parseFloat(coin.priceUsd) * this.audConversionRate / 100,
      changePercent: parseFloat(coin.changePercent24Hr),
      marketCap: parseFloat(coin.marketCapUsd) * this.audConversionRate,
      volume: parseFloat(coin.volumeUsd24Hr) * this.audConversionRate,
      value: coin.id,
      label: `${coin.name} (${coin.symbol})`,
      rank: index + 1
    }));
  }

  async getCryptoNews(): Promise<NewsItem[]> {
    try {
      const response = await fetch(
        'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest&categories=BTC,ETH,Blockchain&api_key=demo'
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.Data?.slice(0, 15).map((article: any) => ({
          id: article.id || article.guid,
          title: article.title,
          summary: article.body?.substring(0, 300) + '...',
          url: article.url,
          source: article.source_info?.name || article.source || 'CryptoCompare',
          publishedAt: new Date(article.published_on * 1000).toISOString(),
          imageUrl: article.imageurl,
          categories: article.categories?.split('|') || [],
          coins: this.extractCoinsFromText(article.title + ' ' + article.body)
        })) || [];
      }
      
      return this.getMockNews();
    } catch (error) {
      console.error('Error fetching crypto news:', error);
      return this.getMockNews();
    }
  }

  private extractCoinsFromText(text: string): string[] {
    const coinMentions = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'ALGO', 'USDT', 'USDC'];
    return coinMentions.filter(coin => 
      text.toUpperCase().includes(coin) || 
      text.toUpperCase().includes(this.getCoinName(coin))
    );
  }

  private getCoinName(symbol: string): string {
    const names: Record<string, string> = {
      'BTC': 'BITCOIN',
      'ETH': 'ETHEREUM',
      'SOL': 'SOLANA',
      'ADA': 'CARDANO',
      'DOT': 'POLKADOT',
      'ALGO': 'ALGORAND'
    };
    return names[symbol] || symbol;
  }

  async getAlgorandData() {
    try {
      const status = await algorandService.getNetworkStatus();
      const algoPrice = await algorandService.getAlgoPrice();
      
      return {
        network: status,
        price: algoPrice,
        provider: 'Algorand (Nodely)',
        status: 'connected',
        lastRound: status['last-round']
      };
    } catch (error) {
      console.error('Error fetching Algorand data:', error);
      return {
        network: null,
        price: 0.48,
        provider: 'Algorand (Nodely)',
        status: 'error',
        lastRound: 0
      };
    }
  }

  async getMarketOverview(): Promise<MarketOverview> {
    try {
      const priceData = await this.getPriceData();
      const totalMarketCap = priceData.reduce((sum, coin) => sum + (coin.marketCap || 0), 0);
      const totalVolume = priceData.reduce((sum, coin) => sum + (coin.volume || 0), 0);
      
      // Calculate BTC dominance
      const btcCoin = priceData.find(coin => coin.symbol === 'BTC');
      const btcDominance = btcCoin && totalMarketCap > 0 
        ? ((btcCoin.marketCap || 0) / totalMarketCap) * 100 
        : 42.5;
      
      return {
        totalMarketCap,
        totalVolume,
        topCoins: priceData.slice(0, 10),
        btcDominance,
        lastUpdated: new Date().toISOString(),
        fearGreedIndex: Math.floor(Math.random() * 100), // Mock fear & greed index
        activeCoins: priceData.length
      };
    } catch (error) {
      console.error('Error getting market overview:', error);
      return this.getMockMarketOverview();
    }
  }

  async searchCryptocurrencies(query: string): Promise<CoinOption[]> {
    try {
      const allCoins = await this.getPriceData();
      return allCoins.filter(coin => 
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
    } catch (error) {
      console.error('Error searching cryptocurrencies:', error);
      return [];
    }
  }

  private getMockPriceData(): CoinOption[] {
    return [
      { 
        id: 'bitcoin', 
        name: 'Bitcoin', 
        symbol: 'BTC', 
        price: 147750, 
        priceChange: 3100, 
        changePercent: 2.1, 
        marketCap: 2925000000000, 
        volume: 68250000000,
        value: 'bitcoin',
        label: 'Bitcoin (BTC)',
        rank: 1
      },
      { 
        id: 'ethereum', 
        name: 'Ethereum', 
        symbol: 'ETH', 
        price: 7800, 
        priceChange: 140, 
        changePercent: 1.8, 
        marketCap: 936000000000, 
        volume: 42600000000,
        value: 'ethereum',
        label: 'Ethereum (ETH)',
        rank: 2
      },
      { 
        id: 'solana', 
        name: 'Solana', 
        symbol: 'SOL', 
        price: 433, 
        priceChange: -2.15, 
        changePercent: -0.5, 
        marketCap: 203400000000, 
        volume: 4860000000,
        value: 'solana',
        label: 'Solana (SOL)',
        rank: 3
      },
      { 
        id: 'cardano', 
        name: 'Cardano', 
        symbol: 'ADA', 
        price: 2.16, 
        priceChange: 0.069, 
        changePercent: 3.2, 
        marketCap: 76000000000, 
        volume: 2736000000,
        value: 'cardano',
        label: 'Cardano (ADA)',
        rank: 4
      },
      { 
        id: 'polkadot', 
        name: 'Polkadot', 
        symbol: 'DOT', 
        price: 19.53, 
        priceChange: -0.215, 
        changePercent: -1.1, 
        marketCap: 27360000000, 
        volume: 1443000000,
        value: 'polkadot',
        label: 'Polkadot (DOT)',
        rank: 5
      },
      {
        id: 'algorand',
        name: 'Algorand',
        symbol: 'ALGO',
        price: 0.73,
        priceChange: 0.018,
        changePercent: 2.5,
        marketCap: 5328000000,
        volume: 129240000,
        value: 'algorand',
        label: 'Algorand (ALGO)',
        rank: 6
      }
    ];
  }

  private getMockNews(): NewsItem[] {
    return [
      {
        id: '1',
        title: 'Bitcoin Reaches New All-Time High in AUD Markets',
        summary: 'Bitcoin has surged to unprecedented levels against the Australian Dollar, driven by institutional adoption and favorable regulatory developments in the region.',
        url: '#',
        source: 'Crypto News AU',
        publishedAt: new Date(Date.now() - 1800000).toISOString(),
        sentiment: 'positive',
        relevance: 95,
        categories: ['Bitcoin', 'Markets'],
        coins: ['BTC']
      },
      {
        id: '2', 
        title: 'Ethereum 2.0 Staking Rewards Continue to Attract Institutional Interest',
        summary: 'Ethereum staking rewards maintain strong performance as more institutional investors participate in the network transition.',
        url: '#',
        source: 'DeFi Daily',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        sentiment: 'positive',
        relevance: 88,
        categories: ['Ethereum', 'DeFi'],
        coins: ['ETH']
      },
      {
        id: '3',
        title: 'Algorand Network Sees Record Transaction Volume',
        summary: 'The Algorand blockchain has processed a record number of transactions this week, highlighting its growing adoption in the DeFi space.',
        url: '#',
        source: 'Blockchain Today',
        publishedAt: new Date(Date.now() - 5400000).toISOString(),
        sentiment: 'positive',
        relevance: 82,
        categories: ['Algorand', 'DeFi'],
        coins: ['ALGO']
      }
    ];
  }

  private getMockMarketOverview(): MarketOverview {
    const mockCoins = this.getMockPriceData();
    const totalMarketCap = mockCoins.reduce((sum, coin) => sum + (coin.marketCap || 0), 0);
    const totalVolume = mockCoins.reduce((sum, coin) => sum + (coin.volume || 0), 0);
    
    return {
      totalMarketCap,
      totalVolume,
      topCoins: mockCoins,
      btcDominance: 42.5,
      lastUpdated: new Date().toISOString(),
      fearGreedIndex: 75,
      activeCoins: mockCoins.length
    };
  }

  getProviderStatus() {
    return this.providers.map(provider => ({
      name: provider.name,
      status: provider.isActive ? 'active' : 'inactive',
      priority: provider.priority,
      errorCount: provider.errorCount,
      lastUsed: provider.lastUsed,
      rateLimit: provider.rateLimit,
      endpoints: Object.keys(provider.endpoints).length
    }));
  }

  async performHealthCheck(): Promise<{ healthy: boolean; details: any[] }> {
    const results = [];
    let healthyCount = 0;

    for (const provider of this.providers) {
      try {
        const testData = await this.fetchFromProvider(provider, ['bitcoin']);
        if (testData && testData.length > 0) {
          healthyCount++;
          results.push({
            provider: provider.name,
            status: 'healthy',
            lastChecked: new Date().toISOString()
          });
        } else {
          results.push({
            provider: provider.name,
            status: 'degraded',
            lastChecked: new Date().toISOString()
          });
        }
      } catch (error) {
        results.push({
          provider: provider.name,
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown error',
          lastChecked: new Date().toISOString()
        });
      }
    }

    return {
      healthy: healthyCount > 0,
      details: results
    };
  }
}

export const freeApiAggregator = new FreeApiAggregator();
export default freeApiAggregator;
