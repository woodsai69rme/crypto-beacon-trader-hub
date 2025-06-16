
import { CoinOption } from '@/types/trading';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const BINANCE_BASE_URL = 'https://api.binance.com/api/v3';

export class RealCryptoApiService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache(key: string): any {
    const cached = this.cache.get(key);
    return cached?.data;
  }

  async getTopCryptocurrencies(limit: number = 100): Promise<CoinOption[]> {
    const cacheKey = `top-cryptos-${limit}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const response = await fetch(
        `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const coins: CoinOption[] = data.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        priceChange: coin.price_change_24h,
        changePercent: coin.price_change_percentage_24h,
        marketCap: coin.market_cap,
        volume: coin.total_volume,
        image: coin.image,
        value: coin.id,
        label: `${coin.name} (${coin.symbol.toUpperCase()})`,
        rank: coin.market_cap_rank
      }));

      this.setCache(cacheKey, coins);
      return coins;
    } catch (error) {
      console.error('Error fetching top cryptocurrencies:', error);
      return this.getFallbackData();
    }
  }

  async getCoinData(coinId: string): Promise<CoinOption | null> {
    const cacheKey = `coin-${coinId}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const response = await fetch(
        `${COINGECKO_BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const coin = await response.json();
      const coinData: CoinOption = {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.market_data.current_price.usd,
        priceChange: coin.market_data.price_change_24h,
        changePercent: coin.market_data.price_change_percentage_24h,
        marketCap: coin.market_data.market_cap.usd,
        volume: coin.market_data.total_volume.usd,
        image: coin.image.large,
        value: coin.id,
        label: `${coin.name} (${coin.symbol.toUpperCase()})`,
        rank: coin.market_cap_rank
      };

      this.setCache(cacheKey, coinData);
      return coinData;
    } catch (error) {
      console.error(`Error fetching coin data for ${coinId}:`, error);
      return null;
    }
  }

  async getCoinHistory(coinId: string, days: number = 30): Promise<any> {
    const cacheKey = `history-${coinId}-${days}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const response = await fetch(
        `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching coin history for ${coinId}:`, error);
      return { prices: [], market_caps: [], total_volumes: [] };
    }
  }

  async getMultipleCoinData(coinIds: string[]): Promise<CoinOption[]> {
    const cacheKey = `multiple-${coinIds.join('-')}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const response = await fetch(
        `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const coins: CoinOption[] = data.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        priceChange: coin.price_change_24h,
        changePercent: coin.price_change_percentage_24h,
        marketCap: coin.market_cap,
        volume: coin.total_volume,
        image: coin.image,
        value: coin.id,
        label: `${coin.name} (${coin.symbol.toUpperCase()})`,
        rank: coin.market_cap_rank
      }));

      this.setCache(cacheKey, coins);
      return coins;
    } catch (error) {
      console.error('Error fetching multiple coin data:', error);
      return this.getFallbackData().filter(coin => coinIds.includes(coin.id));
    }
  }

  private getFallbackData(): CoinOption[] {
    return [
      {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 45000,
        priceChange: 1200,
        changePercent: 2.7,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        volume: 25000000000,
        marketCap: 850000000000,
        value: 'bitcoin',
        label: 'Bitcoin (BTC)',
        rank: 1
      },
      {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        price: 3000,
        priceChange: 150,
        changePercent: 5.3,
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        volume: 15000000000,
        marketCap: 350000000000,
        value: 'ethereum',
        label: 'Ethereum (ETH)',
        rank: 2
      },
      {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        price: 120,
        priceChange: -5,
        changePercent: -4.0,
        image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
        volume: 2000000000,
        marketCap: 50000000000,
        value: 'solana',
        label: 'Solana (SOL)',
        rank: 3
      }
    ];
  }
}

export const realCryptoApi = new RealCryptoApiService();
