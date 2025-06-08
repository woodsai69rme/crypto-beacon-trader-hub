import { CoinOption, CryptoData, CryptoChartData } from '@/types/trading';
import { toast } from "@/components/ui/use-toast";

export interface MarketDataProvider {
  id: string;
  name: string;
  baseUrl: string;
  isActive: boolean;
  rateLimit: number;
  apiKey?: string;
}

export class MarketDataService {
  private providers: MarketDataProvider[] = [
    {
      id: 'coingecko',
      name: 'CoinGecko',
      baseUrl: 'https://api.coingecko.com/api/v3',
      isActive: true,
      rateLimit: 10
    },
    {
      id: 'coinmarketcap',
      name: 'CoinMarketCap',
      baseUrl: 'https://pro-api.coinmarketcap.com/v1',
      isActive: false,
      rateLimit: 30
    },
    {
      id: 'cryptocompare',
      name: 'CryptoCompare',
      baseUrl: 'https://min-api.cryptocompare.com/data',
      isActive: true,
      rateLimit: 100
    },
    {
      id: 'binance',
      name: 'Binance',
      baseUrl: 'https://api.binance.com/api/v3',
      isActive: true,
      rateLimit: 1200
    },
    {
      id: 'coinbase',
      name: 'Coinbase',
      baseUrl: 'https://api.exchange.coinbase.com',
      isActive: true,
      rateLimit: 30
    }
  ];

  async getMarketData(symbols: string[] = ['bitcoin', 'ethereum'], limit: number = 100): Promise<CryptoData[]> {
    const activeProvider = this.providers.find(p => p.isActive);
    if (!activeProvider) {
      return this.getMockData(symbols, limit);
    }

    try {
      switch (activeProvider.id) {
        case 'coingecko':
          return await this.fetchFromCoinGecko(symbols, limit);
        case 'cryptocompare':
          return await this.fetchFromCryptoCompare(symbols, limit);
        case 'binance':
          return await this.fetchFromBinance(symbols, limit);
        default:
          return this.getMockData(symbols, limit);
      }
    } catch (error) {
      console.error(`Error fetching from ${activeProvider.name}:`, error);
      toast({
        title: "API Error",
        description: `Failed to fetch from ${activeProvider.name}. Using mock data.`,
        variant: "destructive",
      });
      return this.getMockData(symbols, limit);
    }
  }

  async getHistoricalData(coinId: string, days: number = 30): Promise<CryptoChartData> {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch historical data');
      
      const data = await response.json();
      
      return {
        id: coinId,
        timestamp: new Date().toISOString(),
        price: data.prices?.[data.prices.length - 1]?.[1] || 0,
        timestamps: data.prices?.map((price: [number, number]) => new Date(price[0]).toISOString()) || [],
        prices: data.prices?.map((price: [number, number]) => price[1]) || [],
        volumes: data.total_volumes?.map((volume: [number, number]) => volume[1]) || [],
        chartData: data.prices || []
      };
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return this.getMockHistoricalData(coinId);
    }
  }

  async getRealTimePrice(coinId: string): Promise<number> {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
      );
      
      if (!response.ok) throw new Error('Failed to fetch real-time price');
      
      const data = await response.json();
      return data[coinId]?.usd || 0;
    } catch (error) {
      console.error('Error fetching real-time price:', error);
      return Math.random() * 50000 + 30000; // Mock price
    }
  }

  async getFearGreedIndex(): Promise<{ value: number; classification: string }> {
    try {
      const response = await fetch('https://api.alternative.me/fng/');
      
      if (!response.ok) throw new Error('Failed to fetch Fear & Greed Index');
      
      const data = await response.json();
      const value = parseInt(data.data[0].value);
      
      let classification = 'Neutral';
      if (value <= 25) classification = 'Extreme Fear';
      else if (value <= 45) classification = 'Fear';
      else if (value <= 55) classification = 'Neutral';
      else if (value <= 75) classification = 'Greed';
      else classification = 'Extreme Greed';
      
      return { value, classification };
    } catch (error) {
      console.error('Error fetching Fear & Greed Index:', error);
      return { value: 50, classification: 'Neutral' };
    }
  }

  private async fetchFromCoinGecko(symbols: string[], limit: number): Promise<CryptoData[]> {
    const ids = symbols.join(',');
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
    );
    
    if (!response.ok) throw new Error('CoinGecko API error');
    
    const data = await response.json();
    return data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      priceChange: coin.price_change_24h,
      changePercent: coin.price_change_percentage_24h,
      volume: coin.total_volume,
      marketCap: coin.market_cap,
      image: coin.image,
      value: coin.id,
      label: `${coin.name} (${coin.symbol.toUpperCase()})`,
      rank: coin.market_cap_rank
    }));
  }

  private async fetchFromCryptoCompare(symbols: string[], limit: number): Promise<CryptoData[]> {
    const fsyms = symbols.map(s => s.toUpperCase()).join(',');
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${fsyms}&tsyms=USD`
    );
    
    if (!response.ok) throw new Error('CryptoCompare API error');
    
    const data = await response.json();
    return Object.keys(data.RAW).map(symbol => {
      const coinData = data.RAW[symbol].USD;
      return {
        id: symbol.toLowerCase(),
        name: symbol,
        symbol: symbol,
        price: coinData.PRICE,
        priceChange: coinData.CHANGE24HOUR,
        changePercent: coinData.CHANGEPCT24HOUR,
        volume: coinData.VOLUME24HOUR,
        marketCap: coinData.MKTCAP,
        value: symbol.toLowerCase(),
        label: `${symbol} (${symbol})`,
        image: `https://www.cryptocompare.com${coinData.IMAGEURL}`
      };
    });
  }

  private async fetchFromBinance(symbols: string[], limit: number): Promise<CryptoData[]> {
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
    
    if (!response.ok) throw new Error('Binance API error');
    
    const data = await response.json();
    return data
      .filter((ticker: any) => ticker.symbol.endsWith('USDT'))
      .slice(0, limit)
      .map((ticker: any) => ({
        id: ticker.symbol.replace('USDT', '').toLowerCase(),
        name: ticker.symbol.replace('USDT', ''),
        symbol: ticker.symbol.replace('USDT', ''),
        price: parseFloat(ticker.lastPrice),
        priceChange: parseFloat(ticker.priceChange),
        changePercent: parseFloat(ticker.priceChangePercent),
        volume: parseFloat(ticker.volume),
        marketCap: 0, // Not available in Binance API
        value: ticker.symbol.replace('USDT', '').toLowerCase(),
        label: `${ticker.symbol.replace('USDT', '')} (${ticker.symbol.replace('USDT', '')})`
      }));
  }

  private getMockData(symbols: string[], limit: number): CryptoData[] {
    const mockCoins = [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', basePrice: 45000 },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', basePrice: 3200 },
      { id: 'cardano', name: 'Cardano', symbol: 'ADA', basePrice: 0.45 },
      { id: 'solana', name: 'Solana', symbol: 'SOL', basePrice: 152 },
      { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', basePrice: 7.5 },
      { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', basePrice: 15.8 },
    ];

    return mockCoins.slice(0, limit).map(coin => {
      const priceVariation = (Math.random() - 0.5) * 0.1;
      const price = coin.basePrice * (1 + priceVariation);
      const changePercent = (Math.random() - 0.5) * 10;
      
      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price,
        priceChange: price * (changePercent / 100),
        changePercent,
        volume: Math.random() * 1000000000,
        marketCap: price * Math.random() * 1000000000,
        value: coin.id,
        label: `${coin.name} (${coin.symbol})`,
        image: '/placeholder.svg'
      };
    });
  }

  private getMockHistoricalData(coinId: string): CryptoChartData {
    const days = 30;
    const basePrice = 45000;
    const timestamps: string[] = [];
    const prices: number[] = [];
    const volumes: number[] = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      timestamps.push(date.toISOString());
      
      const price = basePrice * (1 + (Math.random() - 0.5) * 0.1);
      prices.push(price);
      volumes.push(Math.random() * 1000000000);
    }
    
    return {
      id: coinId,
      timestamp: new Date().toISOString(),
      price: prices[prices.length - 1],
      timestamps,
      prices,
      volumes,
      chartData: prices.map((price, index) => [Date.now() - (days - index) * 24 * 60 * 60 * 1000, price])
    };
  }
}

export const marketDataService = new MarketDataService();
