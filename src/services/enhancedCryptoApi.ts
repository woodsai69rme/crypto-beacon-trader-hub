
import { CoinOption } from "@/types/trading";

// Sample data for demo purposes
const sampleCoinData: CoinOption[] = [
  { 
    id: "bitcoin", 
    name: "Bitcoin", 
    symbol: "BTC", 
    price: 56789.12,
    priceChange: 2.5,
    changePercent: 2.5,
    image: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
    volume: 68970123456,
    marketCap: 1234567890123,
    rank: 1,
    value: "bitcoin",
    label: "Bitcoin (BTC)",
    priceAUD: 86543.21,
    priceEUR: 52345.67,
    priceGBP: 45678.90
  },
  { 
    id: "ethereum", 
    name: "Ethereum", 
    symbol: "ETH", 
    price: 3456.78,
    priceChange: -1.2,
    changePercent: -1.2,
    image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    volume: 23456789012,
    marketCap: 456789012345,
    rank: 2,
    value: "ethereum",
    label: "Ethereum (ETH)",
    priceAUD: 5234.56,
    priceEUR: 3123.45,
    priceGBP: 2789.12
  },
  { 
    id: "cardano", 
    name: "Cardano", 
    symbol: "ADA", 
    price: 0.45,
    priceChange: 3.7,
    changePercent: 3.7,
    image: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
    volume: 1234567890,
    marketCap: 23456789012,
    rank: 8,
    value: "cardano",
    label: "Cardano (ADA)",
    priceAUD: 0.68,
    priceEUR: 0.42,
    priceGBP: 0.37
  },
  { 
    id: "solana", 
    name: "Solana", 
    symbol: "SOL", 
    price: 123.45,
    priceChange: 5.2,
    changePercent: 5.2,
    image: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
    volume: 7890123456,
    marketCap: 56789012345,
    rank: 5,
    value: "solana",
    label: "Solana (SOL)",
    priceAUD: 187.23,
    priceEUR: 112.34,
    priceGBP: 99.87
  },
  { 
    id: "ripple", 
    name: "XRP", 
    symbol: "XRP", 
    price: 0.67,
    priceChange: -0.8,
    changePercent: -0.8,
    image: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
    volume: 3456789012,
    marketCap: 34567890123,
    rank: 6,
    value: "ripple",
    label: "XRP (XRP)",
    priceAUD: 1.02,
    priceEUR: 0.61,
    priceGBP: 0.54
  }
];

// Search coins based on query
export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Filter coins based on query
  if (!query) return sampleCoinData;
  
  const lowerCaseQuery = query.toLowerCase();
  return sampleCoinData.filter(coin => 
    coin.name.toLowerCase().includes(lowerCaseQuery) ||
    coin.symbol.toLowerCase().includes(lowerCaseQuery)
  );
};

// Get detailed information about a specific coin
export const getCoinDetails = async (coinId: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const coin = sampleCoinData.find(c => c.id === coinId);
  if (!coin) throw new Error(`Coin with ID ${coinId} not found`);
  
  return {
    ...coin,
    description: "This is a sample coin description.",
    websiteUrl: "https://example.com",
    github: "https://github.com/example/example",
    reddit: "https://reddit.com/r/example",
    twitter: "https://twitter.com/example",
    sentimentUp: 78,
    sentimentDown: 22,
    allTimeHigh: coin.price * 1.5,
    allTimeHighDate: "2021-11-10T14:24:11.849Z",
    circulatingSupply: 19000000,
    totalSupply: 21000000,
    fullyDilutedValuation: coin.price * 21000000,
    priceHistory: [
      { date: "2023-01-01", price: coin.price * 0.7 },
      { date: "2023-02-01", price: coin.price * 0.8 },
      { date: "2023-03-01", price: coin.price * 0.75 },
      { date: "2023-04-01", price: coin.price * 0.9 },
      { date: "2023-05-01", price: coin.price * 0.95 },
      { date: "2023-06-01", price: coin.price * 1.1 },
      { date: "2023-07-01", price: coin.price * 1.05 },
      { date: "2023-08-01", price: coin.price * 1.2 },
      { date: "2023-09-01", price: coin.price * 1.15 },
      { date: "2023-10-01", price: coin.price * 1.0 },
    ],
  };
};

// Fetch crypto market overview data
export const getMarketOverview = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    totalMarketCap: 2456789012345,
    total24hVolume: 123456789012,
    btcDominance: 42.3,
    ethDominance: 17.8,
    totalCoins: 10583,
    totalExchanges: 567,
    marketCapChange: 3.2,
    trending: sampleCoinData.slice(0, 3),
  };
};
