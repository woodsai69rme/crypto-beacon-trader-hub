
import { CoinOption, ApiProvider } from '@/types/trading';
import { enhancedAlgorandService } from '../algorand/enhancedAlgorandService';

interface AggregatedMarketData {
  coin: CoinOption;
  priceAUD: number;
  change24h: number;
  volume: number;
  marketCap: number;
  lastUpdated: string;
  source: string;
}

interface ExchangeRates {
  AUD: number;
  USD: number;
  EUR: number;
  GBP: number;
  JPY: number;
  CAD: number;
}

class EnhancedFreeApiAggregator {
  private exchangeRates: ExchangeRates = {
    AUD: 1,
    USD: 0.64,
    EUR: 0.61,
    GBP: 0.52,
    JPY: 97.8,
    CAD: 0.91
  };

  private apiProviders: ApiProvider[] = [
    {
      id: 'coingecko',
      name: 'CoinGecko',
      type: 'free',
      url: 'https://api.coingecko.com/api/v3',
      documentation: 'https://www.coingecko.com/en/api/documentation',
      rateLimit: { requestsPerMinute: 30, requestsPerDay: 1000 },
      endpoints: {
        price: '/simple/price',
        markets: '/coins/markets',
        assets: '/coins/list'
      },
      isActive: true
    },
    {
      id: 'cryptocompare',
      name: 'CryptoCompare',
      type: 'free',
      url: 'https://min-api.cryptocompare.com/data',
      documentation: 'https://min-api.cryptocompare.com/documentation',
      rateLimit: { requestsPerMinute: 20, requestsPerDay: 2000 },
      endpoints: {
        price: '/price',
        markets: '/top/mktcapfull',
        assets: '/all/coinlist'
      },
      isActive: true
    },
    {
      id: 'coincap',
      name: 'CoinCap',
      type: 'free',
      url: 'https://api.coincap.io/v2',
      documentation: 'https://docs.coincap.io/',
      rateLimit: { requestsPerMinute: 200, requestsPerDay: 10000 },
      endpoints: {
        price: '/assets',
        markets: '/assets',
        assets: '/assets'
      },
      isActive: true
    },
    {
      id: 'algorand',
      name: 'Algorand Network',
      type: 'free',
      url: 'https://mainnet-api.4160.nodely.io',
      documentation: 'https://mainnet-idx.4160.nodely.dev/x2/api-docs/',
      rateLimit: { requestsPerMinute: 100, requestsPerDay: 5000 },
      endpoints: {
        price: '/v2/status',
        markets: '/v2/accounts',
        assets: '/v2/assets'
      },
      isActive: true
    }
  ];

  async updateExchangeRates(): Promise<void> {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/AUD');
      const data = await response.json();
      
      this.exchangeRates = {
        AUD: 1,
        USD: 1 / data.rates.USD,
        EUR: 1 / data.rates.EUR,
        GBP: 1 / data.rates.GBP,
        JPY: 1 / data.rates.JPY,
        CAD: 1 / data.rates.CAD
      };
      
      console.log('Exchange rates updated:', this.exchangeRates);
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
    }
  }

  private convertToAUD(amount: number, fromCurrency: string = 'USD'): number {
    const rate = this.exchangeRates[fromCurrency as keyof ExchangeRates] || this.exchangeRates.USD;
    return amount / rate;
  }

  async getCoinGeckoData(symbols: string[] = ['bitcoin', 'ethereum', 'solana', 'cardano']): Promise<AggregatedMarketData[]> {
    try {
      const symbolsParam = symbols.join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${symbolsParam}&vs_currencies=usd,aud&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
      );
      
      if (!response.ok) throw new Error(`CoinGecko API error: ${response.status}`);
      
      const data = await response.json();
      
      return symbols.map(symbol => {
        const coinData = data[symbol];
        if (!coinData) return null;
        
        return {
          coin: {
            id: symbol,
            name: symbol.charAt(0).toUpperCase() + symbol.slice(1),
            symbol: symbol.toUpperCase(),
            price: coinData.aud || this.convertToAUD(coinData.usd),
            value: symbol,
            label: `${symbol.charAt(0).toUpperCase() + symbol.slice(1)} (${symbol.toUpperCase()})`
          },
          priceAUD: coinData.aud || this.convertToAUD(coinData.usd),
          change24h: coinData.usd_24h_change || 0,
          volume: coinData.usd_24h_vol || 0,
          marketCap: coinData.usd_market_cap || 0,
          lastUpdated: new Date().toISOString(),
          source: 'CoinGecko'
        };
      }).filter(Boolean) as AggregatedMarketData[];
    } catch (error) {
      console.error('Error fetching CoinGecko data:', error);
      return [];
    }
  }

  async getCryptoCompareData(symbols: string[] = ['BTC', 'ETH', 'SOL', 'ADA']): Promise<AggregatedMarketData[]> {
    try {
      const symbolsParam = symbols.join(',');
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbolsParam}&tsyms=USD,AUD`
      );
      
      if (!response.ok) throw new Error(`CryptoCompare API error: ${response.status}`);
      
      const data = await response.json();
      
      return symbols.map(symbol => {
        const coinData = data.RAW?.[symbol];
        if (!coinData) return null;
        
        const audData = coinData.AUD || coinData.USD;
        const usdPrice = coinData.USD?.PRICE || 0;
        const audPrice = coinData.AUD?.PRICE || this.convertToAUD(usdPrice);
        
        return {
          coin: {
            id: symbol.toLowerCase(),
            name: symbol,
            symbol: symbol,
            price: audPrice,
            value: symbol,
            label: `${symbol} (${symbol})`
          },
          priceAUD: audPrice,
          change24h: audData?.CHANGEPCT24HOUR || 0,
          volume: audData?.VOLUME24HOUR || 0,
          marketCap: audData?.MKTCAP || 0,
          lastUpdated: new Date().toISOString(),
          source: 'CryptoCompare'
        };
      }).filter(Boolean) as AggregatedMarketData[];
    } catch (error) {
      console.error('Error fetching CryptoCompare data:', error);
      return [];
    }
  }

  async getCoinCapData(symbols: string[] = ['bitcoin', 'ethereum', 'solana', 'cardano']): Promise<AggregatedMarketData[]> {
    try {
      const response = await fetch('https://api.coincap.io/v2/assets?limit=100');
      
      if (!response.ok) throw new Error(`CoinCap API error: ${response.status}`);
      
      const data = await response.json();
      
      return data.data
        .filter((asset: any) => symbols.includes(asset.id.toLowerCase()))
        .map((asset: any) => ({
          coin: {
            id: asset.id,
            name: asset.name,
            symbol: asset.symbol,
            price: this.convertToAUD(parseFloat(asset.priceUsd)),
            value: asset.symbol,
            label: `${asset.name} (${asset.symbol})`
          },
          priceAUD: this.convertToAUD(parseFloat(asset.priceUsd)),
          change24h: parseFloat(asset.changePercent24Hr) || 0,
          volume: parseFloat(asset.volumeUsd24Hr) || 0,
          marketCap: parseFloat(asset.marketCapUsd) || 0,
          lastUpdated: new Date().toISOString(),
          source: 'CoinCap'
        }));
    } catch (error) {
      console.error('Error fetching CoinCap data:', error);
      return [];
    }
  }

  async getAlgorandData(): Promise<AggregatedMarketData[]> {
    try {
      const algoPrice = await enhancedAlgorandService.getAlgoPrice();
      const networkMetrics = await enhancedAlgorandService.getNetworkMetrics();
      
      return [{
        coin: {
          id: 'algorand',
          name: 'Algorand',
          symbol: 'ALGO',
          price: algoPrice,
          value: 'ALGO',
          label: 'Algorand (ALGO)'
        },
        priceAUD: algoPrice,
        change24h: 0, // Would need historical data for this
        volume: 0, // Would need to aggregate from exchanges
        marketCap: 0, // Would need total supply data
        lastUpdated: new Date().toISOString(),
        source: 'Algorand Network'
      }];
    } catch (error) {
      console.error('Error fetching Algorand data:', error);
      return [];
    }
  }

  async getAggregatedMarketData(symbols?: string[]): Promise<AggregatedMarketData[]> {
    await this.updateExchangeRates();
    
    const allData: AggregatedMarketData[] = [];
    
    try {
      // Fetch from all providers in parallel
      const [coinGeckoData, cryptoCompareData, coinCapData, algorandData] = await Promise.allSettled([
        this.getCoinGeckoData(symbols),
        this.getCryptoCompareData(symbols?.map(s => s.toUpperCase())),
        this.getCoinCapData(symbols),
        this.getAlgorandData()
      ]);
      
      // Combine data from all sources
      if (coinGeckoData.status === 'fulfilled') allData.push(...coinGeckoData.value);
      if (cryptoCompareData.status === 'fulfilled') allData.push(...cryptoCompareData.value);
      if (coinCapData.status === 'fulfilled') allData.push(...coinCapData.value);
      if (algorandData.status === 'fulfilled') allData.push(...algorandData.value);
      
      // Deduplicate and merge data for the same coins
      const mergedData = this.mergeMarketData(allData);
      
      console.log(`Aggregated data from ${allData.length} sources:`, mergedData);
      return mergedData;
      
    } catch (error) {
      console.error('Error aggregating market data:', error);
      return this.getFallbackData();
    }
  }

  private mergeMarketData(data: AggregatedMarketData[]): AggregatedMarketData[] {
    const merged = new Map<string, AggregatedMarketData>();
    
    data.forEach(item => {
      const key = item.coin.symbol.toLowerCase();
      const existing = merged.get(key);
      
      if (!existing) {
        merged.set(key, item);
      } else {
        // Prefer CoinGecko data, then CryptoCompare, then others
        const priority = { 'CoinGecko': 3, 'CryptoCompare': 2, 'CoinCap': 1, 'Algorand Network': 1 };
        const existingPriority = priority[existing.source as keyof typeof priority] || 0;
        const newPriority = priority[item.source as keyof typeof priority] || 0;
        
        if (newPriority > existingPriority) {
          merged.set(key, item);
        }
      }
    });
    
    return Array.from(merged.values());
  }

  private getFallbackData(): AggregatedMarketData[] {
    const fallbackCoins = [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 64000 },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3200 },
      { id: 'solana', name: 'Solana', symbol: 'SOL', price: 140 },
      { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.65 },
      { id: 'algorand', name: 'Algorand', symbol: 'ALGO', price: 0.48 }
    ];
    
    return fallbackCoins.map(coin => ({
      coin: {
        ...coin,
        value: coin.symbol,
        label: `${coin.name} (${coin.symbol})`
      },
      priceAUD: this.convertToAUD(coin.price),
      change24h: (Math.random() - 0.5) * 10,
      volume: Math.random() * 1000000000,
      marketCap: Math.random() * 100000000000,
      lastUpdated: new Date().toISOString(),
      source: 'Fallback Data'
    }));
  }

  async getCoinPrice(coinId: string): Promise<number> {
    try {
      const data = await this.getAggregatedMarketData([coinId]);
      return data[0]?.priceAUD || 0;
    } catch (error) {
      console.error(`Error fetching price for ${coinId}:`, error);
      return 0;
    }
  }

  async getTopCoinsByMarketCap(limit: number = 10): Promise<AggregatedMarketData[]> {
    try {
      const data = await this.getAggregatedMarketData();
      return data
        .sort((a, b) => b.marketCap - a.marketCap)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching top coins:', error);
      return [];
    }
  }

  getApiProviders(): ApiProvider[] {
    return this.apiProviders;
  }

  async testApiConnections(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const provider of this.apiProviders) {
      try {
        switch (provider.id) {
          case 'coingecko':
            await this.getCoinGeckoData(['bitcoin']);
            results[provider.id] = true;
            break;
          case 'cryptocompare':
            await this.getCryptoCompareData(['BTC']);
            results[provider.id] = true;
            break;
          case 'coincap':
            await this.getCoinCapData(['bitcoin']);
            results[provider.id] = true;
            break;
          case 'algorand':
            await enhancedAlgorandService.healthCheck();
            results[provider.id] = true;
            break;
          default:
            results[provider.id] = false;
        }
      } catch (error) {
        console.error(`Connection test failed for ${provider.id}:`, error);
        results[provider.id] = false;
      }
    }
    
    return results;
  }
}

export const enhancedFreeApiAggregator = new EnhancedFreeApiAggregator();
export default enhancedFreeApiAggregator;
