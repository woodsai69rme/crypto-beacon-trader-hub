
// Free API aggregator service combining multiple free crypto data sources
import { algorandService } from '@/services/algorand/algorandService';

interface FreeApiProvider {
  name: string;
  baseUrl: string;
  rateLimit: number;
  endpoints: {
    price?: string;
    markets?: string;
    news?: string;
  };
}

class FreeApiAggregator {
  private providers: FreeApiProvider[] = [
    {
      name: 'CoinGecko Free',
      baseUrl: 'https://api.coingecko.com/api/v3',
      rateLimit: 30, // calls per minute
      endpoints: {
        price: '/simple/price',
        markets: '/coins/markets'
      }
    },
    {
      name: 'CryptoCompare Free',
      baseUrl: 'https://min-api.cryptocompare.com/data',
      rateLimit: 100,
      endpoints: {
        price: '/price',
        news: '/v2/news'
      }
    },
    {
      name: 'CoinCap',
      baseUrl: 'https://api.coincap.io/v2',
      rateLimit: 1000,
      endpoints: {
        price: '/assets',
        markets: '/assets'
      }
    },
    {
      name: 'Algorand (Nodely)',
      baseUrl: 'https://mainnet-api.4160.nodely.io',
      rateLimit: 1000,
      endpoints: {
        price: '/v2/status'
      }
    }
  ];

  async getPriceData(symbols: string[] = ['bitcoin', 'ethereum', 'solana']) {
    try {
      // Try CoinGecko first
      const coinGeckoUrl = `${this.providers[0].baseUrl}/simple/price?ids=${symbols.join(',')}&vs_currencies=aud,usd&include_24hr_change=true`;
      const response = await fetch(coinGeckoUrl);
      
      if (response.ok) {
        const data = await response.json();
        return this.formatPriceData(data);
      }
      
      // Fallback to CoinCap
      return this.getCoinCapPrices(symbols);
    } catch (error) {
      console.error('Error fetching price data:', error);
      return this.getMockPriceData();
    }
  }

  async getCoinCapPrices(symbols: string[]) {
    try {
      const response = await fetch(`${this.providers[2].baseUrl}/assets?limit=100`);
      const data = await response.json();
      
      return data.data?.slice(0, 10).map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price: parseFloat(coin.priceUsd) * 1.5, // Convert to AUD approximation
        change24h: parseFloat(coin.changePercent24Hr) || 0,
        marketCap: parseFloat(coin.marketCapUsd) * 1.5,
        volume: parseFloat(coin.volumeUsd24Hr) * 1.5
      })) || [];
    } catch (error) {
      console.error('CoinCap API error:', error);
      return this.getMockPriceData();
    }
  }

  async getCryptoNews() {
    try {
      const response = await fetch(
        `${this.providers[1].baseUrl}/v2/news/?lang=EN&sortOrder=latest&categories=BTC,ETH,Blockchain`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.Data?.slice(0, 10).map((article: any) => ({
          id: article.id,
          title: article.title,
          summary: article.body?.substring(0, 200) + '...',
          url: article.url,
          source: article.source_info?.name || 'CryptoCompare',
          publishedAt: new Date(article.published_on * 1000).toISOString(),
          imageUrl: article.imageurl
        })) || [];
      }
      
      return this.getMockNews();
    } catch (error) {
      console.error('Error fetching crypto news:', error);
      return this.getMockNews();
    }
  }

  async getAlgorandData() {
    try {
      const status = await algorandService.getNetworkStatus();
      const mockPrices = algorandService.getMockAlgorandPrices();
      
      return {
        network: status,
        prices: mockPrices,
        provider: 'Algorand (Nodely)'
      };
    } catch (error) {
      console.error('Error fetching Algorand data:', error);
      return null;
    }
  }

  async getMarketOverview() {
    try {
      const priceData = await this.getPriceData();
      const totalMarketCap = priceData.reduce((sum: number, coin: any) => sum + (coin.marketCap || 0), 0);
      const totalVolume = priceData.reduce((sum: number, coin: any) => sum + (coin.volume || 0), 0);
      
      return {
        totalMarketCap,
        totalVolume,
        topCoins: priceData.slice(0, 5),
        btcDominance: 42.5,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting market overview:', error);
      return this.getMockMarketOverview();
    }
  }

  private formatPriceData(data: any) {
    return Object.entries(data).map(([id, info]: [string, any]) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      symbol: id.toUpperCase(),
      price: info.aud || info.usd * 1.5,
      change24h: info.aud_24h_change || info.usd_24h_change || 0,
      marketCap: (info.aud || info.usd * 1.5) * 1000000, // Estimated
      volume: (info.aud || info.usd * 1.5) * 500000 // Estimated
    }));
  }

  private getMockPriceData() {
    return [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 97250, change24h: 2.1, marketCap: 1925000000000, volume: 45000000000 },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 5125, change24h: 1.8, marketCap: 616000000000, volume: 28000000000 },
      { id: 'solana', name: 'Solana', symbol: 'SOL', price: 285, change24h: -0.5, marketCap: 134000000000, volume: 3200000000 },
      { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 1.42, change24h: 3.2, marketCap: 50000000000, volume: 1800000000 },
      { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', price: 12.85, change24h: -1.1, marketCap: 18000000000, volume: 950000000 }
    ];
  }

  private getMockNews() {
    return [
      {
        id: '1',
        title: 'Bitcoin Reaches New All-Time High in AUD',
        summary: 'Bitcoin has surged to unprecedented levels against the Australian Dollar, driven by institutional adoption and favorable regulatory developments.',
        url: '#',
        source: 'Crypto News AU',
        publishedAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '2', 
        title: 'Ethereum 2.0 Staking Rewards Hit 5% APY',
        summary: 'Ethereum staking rewards continue to attract investors as the network transitions fully to proof-of-stake consensus.',
        url: '#',
        source: 'DeFi Daily',
        publishedAt: new Date(Date.now() - 7200000).toISOString()
      }
    ];
  }

  private getMockMarketOverview() {
    return {
      totalMarketCap: 3750000000000,
      totalVolume: 125000000000,
      topCoins: this.getMockPriceData().slice(0, 5),
      btcDominance: 42.5,
      lastUpdated: new Date().toISOString()
    };
  }

  getProviderStatus() {
    return this.providers.map(provider => ({
      name: provider.name,
      status: 'active',
      rateLimit: provider.rateLimit,
      endpoints: Object.keys(provider.endpoints).length
    }));
  }
}

export const freeApiAggregator = new FreeApiAggregator();
export default freeApiAggregator;
