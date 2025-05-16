
import { CoinOption, CryptoData, PricePoint } from '@/types/trading';

export const fetchCryptoData = async (coins: string[]): Promise<CoinOption[]> => {
  // Mock implementation
  return coins.map((coin, index) => ({
    id: coin,
    name: coin.charAt(0).toUpperCase() + coin.slice(1),
    symbol: coin.substring(0, 3).toUpperCase(),
    price: 1000 * (index + 1),
    priceChange: Math.random() * 10 - 5,
    changePercent: Math.random() * 10 - 5,
    image: `https://assets.coingecko.com/coins/images/${index + 1}/small/${coin}.png`,
    value: coin,
    label: `${coin.charAt(0).toUpperCase() + coin.slice(1)} (${coin.substring(0, 3).toUpperCase()})`
  }));
};

// Add the missing fetchCoinHistory function
export const fetchCoinHistory = async (
  coinId: string,
  days: number,
  currency: string = 'aud'
): Promise<[number, number][]> => {
  // Mock implementation
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  const points = 100;
  
  const timeRange = days * dayInMs;
  
  const startPrice = 1000 + Math.random() * 9000;
  const volatility = 0.02;
  
  return Array.from({ length: points }, (_, i) => {
    const timestamp = now - (timeRange * (1 - i / points));
    
    // Simple random walk for price simulation
    const timeFactor = i / points;
    const trendFactor = Math.sin(timeFactor * Math.PI) * 0.5 + 0.5; // Trend goes up and down
    const randomFactor = (Math.random() - 0.5) * 2 * volatility;
    
    const price = startPrice * (1 + trendFactor * 0.5 + randomFactor);
    
    return [timestamp, price];
  });
};

export const fetchCryptoHistory = async (
  coinId: string,
  timeframe: string,
  currency: string = 'aud'
): Promise<[number, number][]> => {
  // Convert timeframe to days for consistency
  let days: number;
  switch (timeframe) {
    case '24h': days = 1; break;
    case '7d': days = 7; break;
    case '30d': days = 30; break;
    case '90d': days = 90; break;
    case '1y': days = 365; break;
    default: days = 7;
  }
  
  return fetchCoinHistory(coinId, days, currency);
};

export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  // Mock implementation
  const mockCoins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 65000 },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3500 },
    { id: 'binancecoin', name: 'Binance Coin', symbol: 'BNB', price: 450 },
    { id: 'solana', name: 'Solana', symbol: 'SOL', price: 150 },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.45 },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', price: 6.50 },
    { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', price: 15.80 },
    { id: 'litecoin', name: 'Litecoin', symbol: 'LTC', price: 75.20 },
    { id: 'bitcoin-cash', name: 'Bitcoin Cash', symbol: 'BCH', price: 245 },
    { id: 'stellar', name: 'Stellar', symbol: 'XLM', price: 0.11 }
  ];
  
  // Filter coins based on query
  const filteredCoins = mockCoins.filter(coin => 
    coin.name.toLowerCase().includes(query.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(query.toLowerCase())
  );
  
  // Transform to CoinOption format
  return filteredCoins.map(coin => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    price: coin.price,
    value: coin.id,
    label: `${coin.name} (${coin.symbol})`
  }));
};

export const formatPrice = (price: number, currency: string = 'AUD'): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency
  }).format(price);
};

