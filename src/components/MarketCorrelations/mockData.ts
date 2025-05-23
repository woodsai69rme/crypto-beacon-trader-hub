
import { CryptoData } from '@/types/trading';

// Mock historical price data
export const mockHistoricalPrices = {
  'bitcoin': Array(30).fill(0).map((_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    price: 50000 + Math.random() * 10000,
    volume: 25000000000 + Math.random() * 5000000000
  })),
  'ethereum': Array(30).fill(0).map((_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    price: 2800 + Math.random() * 600,
    volume: 15000000000 + Math.random() * 3000000000
  })),
  'binancecoin': Array(30).fill(0).map((_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    price: 500 + Math.random() * 100,
    volume: 2000000000 + Math.random() * 500000000
  })),
  'solana': Array(30).fill(0).map((_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    price: 100 + Math.random() * 40,
    volume: 3000000000 + Math.random() * 500000000
  })),
  'cardano': Array(30).fill(0).map((_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    price: 0.4 + Math.random() * 0.2,
    volume: 1000000000 + Math.random() * 300000000
  })),
};

// Sample coins for correlation data
export const mockCoins: CryptoData[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 58352.12,
    priceChange: 1245.32,
    changePercent: 2.18,
    marketCap: 1143349097968,
    volume: 48941516789,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 3105.78,
    priceChange: 65.43,
    changePercent: 2.15,
    marketCap: 373952067386,
    volume: 21891456789,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
  },
  {
    id: "binancecoin",
    name: "Binance Coin",
    symbol: "BNB",
    price: 604.12,
    priceChange: 12.45,
    changePercent: 2.10,
    marketCap: 93518794521,
    volume: 1862354123,
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png"
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 143.87,
    priceChange: 7.23,
    changePercent: 5.29,
    marketCap: 63287612543,
    volume: 3691845721,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png"
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    price: 0.45,
    priceChange: 0.02,
    changePercent: 4.65,
    marketCap: 16789456123,
    volume: 756123489,
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png"
  }
];

// Mock correlation matrix data
export const mockCorrelationMatrix = [
  { asset1: "bitcoin", asset2: "ethereum", correlation: 0.85 },
  { asset1: "bitcoin", asset2: "binancecoin", correlation: 0.72 },
  { asset1: "bitcoin", asset2: "solana", correlation: 0.68 },
  { asset1: "bitcoin", asset2: "cardano", correlation: 0.65 },
  { asset1: "ethereum", asset2: "binancecoin", correlation: 0.78 },
  { asset1: "ethereum", asset2: "solana", correlation: 0.81 },
  { asset1: "ethereum", asset2: "cardano", correlation: 0.7 },
  { asset1: "binancecoin", asset2: "solana", correlation: 0.62 },
  { asset1: "binancecoin", asset2: "cardano", correlation: 0.58 },
  { asset1: "solana", asset2: "cardano", correlation: 0.75 },
];

// Combined mock correlation data for components
export const mockCorrelationData = {
  coins: mockCoins,
  correlationMatrix: mockCorrelationMatrix,
  timeframe: "30d"
};

export const mockCryptoData: CryptoData[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 58352.12,
    priceChange: 1245.32,
    changePercent: 2.18,
    marketCap: 1143349097968,
    volume: 48941516789,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 3105.78,
    priceChange: 65.43,
    changePercent: 2.15,
    marketCap: 373952067386,
    volume: 21891456789,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
  },
  {
    id: "binancecoin",
    name: "Binance Coin",
    symbol: "BNB",
    price: 604.12,
    priceChange: 12.45,
    changePercent: 2.10,
    marketCap: 93518794521,
    volume: 1862354123,
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png"
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 143.87,
    priceChange: 7.23,
    changePercent: 5.29,
    marketCap: 63287612543,
    volume: 3691845721,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png"
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    price: 0.45,
    priceChange: 0.02,
    changePercent: 4.65,
    marketCap: 16789456123,
    volume: 756123489,
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png"
  },
];
