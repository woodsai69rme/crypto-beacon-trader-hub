
import { CoinOption } from '@/types/trading';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
}

export class CryptoApiService {
  private audExchangeRate = 1.48; // USD to AUD conversion rate

  async getTopCryptocurrencies(limit: number = 50): Promise<CoinOption[]> {
    try {
      const response = await fetch(
        `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch cryptocurrency data');
      }
      
      const data: CryptoPrice[] = await response.json();
      
      return data.map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price * this.audExchangeRate, // Convert to AUD
        priceChange: coin.price_change_24h * this.audExchangeRate,
        changePercent: coin.price_change_percentage_24h,
        marketCap: coin.market_cap * this.audExchangeRate,
        volume: coin.total_volume * this.audExchangeRate,
        image: coin.image,
        value: coin.id,
        label: `${coin.name} (${coin.symbol.toUpperCase()})`
      }));
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return this.getFallbackData();
    }
  }

  async getCoinPrice(coinId: string): Promise<number> {
    try {
      const response = await fetch(
        `${COINGECKO_BASE_URL}/simple/price?ids=${coinId}&vs_currencies=usd`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch coin price');
      }
      
      const data = await response.json();
      return data[coinId]?.usd * this.audExchangeRate || 0;
    } catch (error) {
      console.error('Error fetching coin price:', error);
      return 0;
    }
  }

  async getMarketData(coinIds: string[]): Promise<CoinOption[]> {
    try {
      const idsString = coinIds.join(',');
      const response = await fetch(
        `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&ids=${idsString}&order=market_cap_desc&sparkline=false`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }
      
      const data: CryptoPrice[] = await response.json();
      
      return data.map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price * this.audExchangeRate,
        priceChange: coin.price_change_24h * this.audExchangeRate,
        changePercent: coin.price_change_percentage_24h,
        marketCap: coin.market_cap * this.audExchangeRate,
        volume: coin.total_volume * this.audExchangeRate,
        image: coin.image,
        value: coin.id,
        label: `${coin.name} (${coin.symbol.toUpperCase()})`
      }));
    } catch (error) {
      console.error('Error fetching market data:', error);
      return this.getFallbackData().slice(0, coinIds.length);
    }
  }

  private getFallbackData(): CoinOption[] {
    return [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        price: 67000 * this.audExchangeRate,
        priceChange: 1200 * this.audExchangeRate,
        changePercent: 1.82,
        marketCap: 1300000000000 * this.audExchangeRate,
        volume: 25000000000 * this.audExchangeRate,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        value: 'bitcoin',
        label: 'Bitcoin (BTC)'
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        price: 3200 * this.audExchangeRate,
        priceChange: -45 * this.audExchangeRate,
        changePercent: -1.39,
        marketCap: 385000000000 * this.audExchangeRate,
        volume: 12000000000 * this.audExchangeRate,
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        value: 'ethereum',
        label: 'Ethereum (ETH)'
      },
      {
        id: 'cardano',
        name: 'Cardano',
        symbol: 'ADA',
        price: 0.52 * this.audExchangeRate,
        priceChange: 0.02 * this.audExchangeRate,
        changePercent: 4.1,
        marketCap: 18000000000 * this.audExchangeRate,
        volume: 500000000 * this.audExchangeRate,
        image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
        value: 'cardano',
        label: 'Cardano (ADA)'
      },
      {
        id: 'solana',
        name: 'Solana',
        symbol: 'SOL',
        price: 98 * this.audExchangeRate,
        priceChange: 3.2 * this.audExchangeRate,
        changePercent: 3.37,
        marketCap: 45000000000 * this.audExchangeRate,
        volume: 2000000000 * this.audExchangeRate,
        image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
        value: 'solana',
        label: 'Solana (SOL)'
      }
    ];
  }
}

export const cryptoApiService = new CryptoApiService();
