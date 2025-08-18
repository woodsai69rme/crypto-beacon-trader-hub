
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
    current_price: 58352.12,
    price: 58352.12,
    price_change_percentage_24h: 2.18,
    change24h: 2.18,
    market_cap: 1143349097968,
    total_volume: 48941516789,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    value: "bitcoin",
    label: "Bitcoin (BTC)",
    priceChange: 1245.32,
    changePercent: 2.18,
    volume: 48941516789,
    marketCap: 1143349097968
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    current_price: 3105.78,
    price: 3105.78,
    price_change_percentage_24h: 2.15,
    change24h: 2.15,
    market_cap: 373952067386,
    total_volume: 21891456789,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    value: "ethereum",
    label: "Ethereum (ETH)",
    priceChange: 65.43,
    changePercent: 2.15,
    volume: 21891456789,
    marketCap: 373952067386
  },
  {
    id: "binancecoin",
    name: "Binance Coin",
    symbol: "BNB",
    current_price: 604.12,
    price: 604.12,
    price_change_percentage_24h: 2.10,
    change24h: 2.10,
    market_cap: 93518794521,
    total_volume: 1862354123,
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    value: "binancecoin",
    label: "Binance Coin (BNB)",
    priceChange: 12.45,
    changePercent: 2.10,
    volume: 1862354123,
    marketCap: 93518794521
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    current_price: 143.87,
    price: 143.87,
    price_change_percentage_24h: 5.29,
    change24h: 5.29,
    market_cap: 63287612543,
    total_volume: 3691845721,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    value: "solana",
    label: "Solana (SOL)",
    priceChange: 7.23,
    changePercent: 5.29,
    volume: 3691845721,
    marketCap: 63287612543
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    current_price: 0.45,
    price: 0.45,
    price_change_percentage_24h: 4.65,
    change24h: 4.65,
    market_cap: 16789456123,
    total_volume: 756123489,
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    value: "cardano",
    label: "Cardano (ADA)",
    priceChange: 0.02,
    changePercent: 4.65,
    volume: 756123489,
    marketCap: 16789456123
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
    current_price: 58352.12,
    price: 58352.12,
    price_change_percentage_24h: 2.18,
    change24h: 2.18,
    market_cap: 1143349097968,
    total_volume: 48941516789,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    value: "bitcoin",
    label: "Bitcoin (BTC)",
    priceChange: 1245.32,
    changePercent: 2.18,
    volume: 48941516789,
    marketCap: 1143349097968
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    current_price: 3105.78,
    price: 3105.78,
    price_change_percentage_24h: 2.15,
    change24h: 2.15,
    market_cap: 373952067386,
    total_volume: 21891456789,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    value: "ethereum",
    label: "Ethereum (ETH)",
    priceChange: 65.43,
    changePercent: 2.15,
    volume: 21891456789,
    marketCap: 373952067386
  },
  {
    id: "binancecoin",
    name: "Binance Coin",
    symbol: "BNB",
    current_price: 604.12,
    price: 604.12,
    price_change_percentage_24h: 2.10,
    change24h: 2.10,
    market_cap: 93518794521,
    total_volume: 1862354123,
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    value: "binancecoin",
    label: "Binance Coin (BNB)",
    priceChange: 12.45,
    changePercent: 2.10,
    volume: 1862354123,
    marketCap: 93518794521
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    current_price: 143.87,
    price: 143.87,
    price_change_percentage_24h: 5.29,
    change24h: 5.29,
    market_cap: 63287612543,
    total_volume: 3691845721,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    value: "solana",
    label: "Solana (SOL)",
    priceChange: 7.23,
    changePercent: 5.29,
    volume: 3691845721,
    marketCap: 63287612543
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    current_price: 0.45,
    price: 0.45,
    price_change_percentage_24h: 4.65,
    change24h: 4.65,
    market_cap: 16789456123,
    total_volume: 756123489,
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    value: "cardano",
    label: "Cardano (ADA)",
    priceChange: 0.02,
    changePercent: 4.65,
    volume: 756123489,
    marketCap: 16789456123
  },
];
