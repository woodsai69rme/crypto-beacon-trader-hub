
import axios from 'axios';
import { updateWithCurrencyRates } from './currencyApi';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
  priceAUD?: number;
}

export interface CryptoChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// Fetch cryptocurrency data from CoinGecko API
export const fetchCryptoData = async (
  limit: number = 10
): Promise<CryptoData[]> => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&locale=en`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return getMockCryptoData(limit);
  }
};

// Fetch historical price data for a specific coin
export const fetchCryptoHistory = async (
  coinId: string,
  days: number = 7
): Promise<CryptoChartData | null> => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    return null;
  }
};

// Generate mock data for when the API fails
export const getMockCryptoData = (count: number = 10): CryptoData[] => {
  const mockCoins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', price: 61245.32 },
    { id: 'ethereum', name: 'Ethereum', symbol: 'eth', price: 3010.45 },
    { id: 'tether', name: 'Tether', symbol: 'usdt', price: 1.00 },
    { id: 'binancecoin', name: 'BNB', symbol: 'bnb', price: 541.87 },
    { id: 'solana', name: 'Solana', symbol: 'sol', price: 142.87 },
    { id: 'xrp', name: 'XRP', symbol: 'xrp', price: 0.57 },
    { id: 'cardano', name: 'Cardano', symbol: 'ada', price: 0.45 },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'doge', price: 0.14 },
    { id: 'polkadot', name: 'Polkadot', symbol: 'dot', price: 6.33 },
    { id: 'matic-network', name: 'Polygon', symbol: 'matic', price: 0.59 },
  ];

  return mockCoins.slice(0, count).map((coin, index) => {
    const mockPrice = coin.price;
    const mockVolume = mockPrice * (1000000 + Math.random() * 10000000);
    const mockMarketCap = mockPrice * (10000000 + Math.random() * 100000000);
    const changePercent = (Math.random() * 10) - 5; // -5% to +5%
    
    return {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      image: `https://via.placeholder.com/30/2196f3/FFFFFF?text=${coin.symbol.toUpperCase()}`,
      current_price: mockPrice,
      market_cap: mockMarketCap,
      market_cap_rank: index + 1,
      fully_diluted_valuation: mockMarketCap * 1.2,
      total_volume: mockVolume,
      high_24h: mockPrice * (1 + Math.random() * 0.05),
      low_24h: mockPrice * (1 - Math.random() * 0.05),
      price_change_24h: mockPrice * (changePercent / 100),
      price_change_percentage_24h: changePercent,
      market_cap_change_24h: mockMarketCap * (changePercent / 100),
      market_cap_change_percentage_24h: changePercent,
      circulating_supply: 10000000 + Math.random() * 90000000,
      total_supply: 20000000 + Math.random() * 80000000,
      max_supply: index % 3 === 0 ? null : 100000000,
      ath: mockPrice * (1 + Math.random() * 0.5),
      ath_change_percentage: -10 - Math.random() * 20,
      ath_date: '2021-11-10T14:24:11.849Z',
      atl: mockPrice * (0.1 + Math.random() * 0.2),
      atl_change_percentage: 1000 + Math.random() * 5000,
      atl_date: '2015-10-20T00:00:00.000Z',
      roi: index % 2 === 0 ? {
        times: 10 + Math.random() * 90,
        currency: 'usd',
        percentage: 1000 + Math.random() * 9000
      } : null,
      last_updated: new Date().toISOString()
    };
  });
};

// Generate mock historical data for testing
export const getMockHistoricalData = (days: number = 7): CryptoChartData => {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const startPrice = 10000 + Math.random() * 50000;
  const prices: [number, number][] = [];
  const marketCaps: [number, number][] = [];
  const volumes: [number, number][] = [];
  
  // Generate data points for each day
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * oneDayMs);
    const randomFactor = 0.98 + Math.random() * 0.04; // 0.98 to 1.02
    const price = i === days ? startPrice : prices[prices.length - 1][1] * randomFactor;
    const marketCap = price * (20000000 + Math.random() * 1000000);
    const volume = price * (500000 + Math.random() * 500000);
    
    prices.push([timestamp, price]);
    marketCaps.push([timestamp, marketCap]);
    volumes.push([timestamp, volume]);
  }
  
  return {
    prices,
    market_caps: marketCaps,
    total_volumes: volumes
  };
};
