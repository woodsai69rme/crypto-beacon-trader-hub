
import { CoinOption, CryptoData, NewsItem } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";

// Base mock data (reuse from cryptoService to maintain consistency)
const mockCoins: CoinOption[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 58352.12,
    priceChange: 1245.32,
    changePercent: 2.18,
    marketCap: 1143349097968,
    volume: 48941516789,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    value: "bitcoin",
    label: "Bitcoin (BTC)"
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
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    value: "ethereum",
    label: "Ethereum (ETH)"
  },
  // ... add more coins here
];

// Mock news data
const mockNewsData: NewsItem[] = [
  {
    id: "news-1",
    title: "Bitcoin Surges Above $50,000 as Institutional Interest Grows",
    source: "CryptoNews",
    timestamp: new Date().toISOString(),
    url: "#",
    content: "Bitcoin has surpassed the $50,000 mark for the first time in several months as institutional interest continues to grow."
  },
  {
    id: "news-2",
    title: "Ethereum 2.0 Upgrade on Track for Q3 Release",
    source: "BlockchainInsider",
    timestamp: new Date().toISOString(),
    url: "#",
    content: "The much-anticipated Ethereum 2.0 upgrade is reportedly on track for a Q3 release according to development team."
  },
  {
    id: "news-3",
    title: "New Regulatory Framework for Cryptocurrencies Proposed",
    source: "CryptoDaily",
    timestamp: new Date().toISOString(),
    url: "#",
    content: "Lawmakers have proposed a new regulatory framework for cryptocurrencies that aims to provide clarity while fostering innovation."
  },
  {
    id: "news-4",
    title: "DeFi Market Cap Reaches All-Time High",
    source: "DeFiNews",
    timestamp: new Date().toISOString(),
    url: "#",
    content: "The total market capitalization of DeFi tokens has reached an all-time high, exceeding $150 billion for the first time."
  },
  {
    id: "news-5",
    title: "Major Bank Announces Cryptocurrency Custody Service",
    source: "FinanceReport",
    timestamp: new Date().toISOString(),
    url: "#",
    content: "A major international bank has announced plans to launch a cryptocurrency custody service for institutional clients."
  }
];

// Extended list with more coins
const extendedCoinList: CoinOption[] = [
  ...mockCoins,
  {
    id: "binancecoin",
    name: "Binance Coin",
    symbol: "BNB",
    price: 604.12,
    priceChange: 12.45,
    changePercent: 2.10,
    marketCap: 93518794521,
    volume: 1862354123,
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    value: "binancecoin",
    label: "Binance Coin (BNB)"
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
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    value: "solana",
    label: "Solana (SOL)"
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
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    value: "cardano",
    label: "Cardano (ADA)"
  },
  {
    id: "ripple",
    name: "XRP",
    symbol: "XRP",
    price: 0.6129,
    priceChange: 0.0103,
    changePercent: 1.71,
    marketCap: 33765432100,
    volume: 2143567890,
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    value: "ripple",
    label: "XRP (XRP)"
  }
];

// Enhanced API methods
export const fetchCoins = async (params: { limit?: number; currency?: string } = {}): Promise<CoinOption[]> => {
  const { limit = 10, currency = 'usd' } = params;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return a subset of mock data with randomized recent prices
  return extendedCoinList.slice(0, limit).map(coin => ({
    ...coin,
    price: coin.price * (1 + (Math.random() * 0.02 - 0.01)),
    priceChange: coin.priceChange * (1 + (Math.random() * 0.1 - 0.05)),
    changePercent: coin.changePercent! * (1 + (Math.random() * 0.1 - 0.05))
  }));
};

export const fetchCoinDetails = async (coinId: string, currency = 'usd'): Promise<CryptoData | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Find the coin in our extended list
  const coin = extendedCoinList.find(c => c.id === coinId);
  
  if (!coin) {
    toast({
      title: "Error",
      description: `Coin ${coinId} not found`,
      variant: "destructive"
    });
    return null;
  }
  
  // Add some randomized data to simulate fresh prices
  return {
    ...coin,
    price: coin.price * (1 + (Math.random() * 0.02 - 0.01)),
    priceChange: coin.priceChange * (1 + (Math.random() * 0.1 - 0.05)),
    changePercent: coin.changePercent! * (1 + (Math.random() * 0.1 - 0.05))
  };
};

export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  if (!query || query.length < 2) return [];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Search through our extended list
  const lowerQuery = query.toLowerCase();
  return extendedCoinList.filter(
    coin => coin.name.toLowerCase().includes(lowerQuery) || 
            coin.symbol.toLowerCase().includes(lowerQuery) ||
            coin.id.toLowerCase().includes(lowerQuery)
  );
};

export const fetchMarketData = async (
  params: { 
    limit?: number; 
    currency?: string; 
    order?: string; 
    category?: string 
  } = {}
): Promise<CryptoData[]> => {
  const { limit = 20, currency = 'usd' } = params;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 900));
  
  // Return a subset with randomized prices
  return extendedCoinList
    .slice(0, limit)
    .map(coin => ({
      ...coin,
      price: coin.price * (1 + (Math.random() * 0.03 - 0.015)),
      priceChange: coin.priceChange * (1 + (Math.random() * 0.1 - 0.05)),
      changePercent: coin.changePercent! * (1 + (Math.random() * 0.1 - 0.05))
    }));
};

export const fetchHistoricalMarketData = async (
  coinId: string, 
  days: number = 30,
  interval?: string
): Promise<Array<{ timestamp: number; price: number }>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find the coin to get a starting price
  const coin = extendedCoinList.find(c => c.id === coinId);
  if (!coin) return [];
  
  const endTimestamp = Date.now();
  const startTimestamp = endTimestamp - (days * 24 * 60 * 60 * 1000);
  
  // Generate points between start and end
  const points = [];
  let lastPrice = coin.price * 0.7; // Start at 70% of current price
  
  // Determine number of data points based on days
  const pointCount = days <= 1 ? 24 : days <= 7 ? days * 8 : days;
  
  for (let i = 0; i <= pointCount; i++) {
    const pointTimestamp = startTimestamp + ((endTimestamp - startTimestamp) * (i / pointCount));
    
    // Add some randomized price movement
    const change = (Math.random() - 0.48) * 0.05; // Slight uptrend
    lastPrice = Math.max(0.01, lastPrice * (1 + change));
    
    points.push({
      timestamp: pointTimestamp,
      price: lastPrice
    });
  }
  
  return points;
};

// Added functions for getTrendingCoins and getLatestNews
export const getTrendingCoins = async (limit: number = 5): Promise<CoinOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Return a subset of the coins in a random order to simulate trending data
  return [...extendedCoinList]
    .sort(() => Math.random() - 0.5)
    .slice(0, limit)
    .map(coin => ({
      ...coin,
      price: coin.price * (1 + (Math.random() * 0.03 - 0.015)),
      priceChange: coin.priceChange * (1 + (Math.random() * 0.15 - 0.05)),
      changePercent: coin.changePercent! * (1 + (Math.random() * 0.15 - 0.05))
    }));
};

export const getLatestNews = async (limit: number = 5): Promise<NewsItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Return news data, limited to requested amount
  return mockNewsData.slice(0, limit);
};

export default {
  fetchCoins,
  fetchCoinDetails,
  searchCoins,
  fetchMarketData,
  fetchHistoricalMarketData,
  getTrendingCoins,
  getLatestNews
};
