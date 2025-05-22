
import { CoinOption, CryptoData } from "@/types/trading";

// Mock data for trending coins
const mockTrendingCoins: CoinOption[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 48000.75,
    priceChange: 1250.25,
    changePercent: 2.67,
    image: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
    marketCap: 902343253453,
    volume: 27453243232,
    value: "bitcoin",
    label: "Bitcoin (BTC)"
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 2350.50,
    priceChange: 65.75,
    changePercent: 2.88,
    image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    marketCap: 282439872364,
    volume: 14325352424,
    value: "ethereum",
    label: "Ethereum (ETH)"
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 120.25,
    priceChange: -5.50,
    changePercent: -4.38,
    image: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
    marketCap: 48765432123,
    volume: 5234543234,
    value: "solana",
    label: "Solana (SOL)"
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    price: 0.45,
    priceChange: 0.01,
    changePercent: 2.27,
    image: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
    marketCap: 15987654321,
    volume: 987654321,
    value: "cardano",
    label: "Cardano (ADA)"
  },
  {
    id: "ripple",
    name: "XRP",
    symbol: "XRP",
    price: 0.52,
    priceChange: -0.02,
    changePercent: -3.70,
    image: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
    marketCap: 27654321098,
    volume: 2109876543,
    value: "ripple",
    label: "XRP (XRP)"
  }
];

// Mock news data
const mockNewsItems = [
  {
    id: "news-1",
    title: "Bitcoin Surges Past $50,000 as Institutional Adoption Continues",
    source: "CryptoNews",
    published_at: new Date().toISOString(),
    url: "https://example.com/news/1"
  },
  {
    id: "news-2",
    title: "Ethereum 2.0 Upgrade Expected to Boost Network Performance",
    source: "CoinDesk",
    published_at: new Date().toISOString(),
    url: "https://example.com/news/2"
  },
  {
    id: "news-3",
    title: "Solana Network Reports Record-Breaking Transaction Throughput",
    source: "CoinTelegraph",
    published_at: new Date().toISOString(),
    url: "https://example.com/news/3"
  },
  {
    id: "news-4",
    title: "Cardano Announces New DeFi Partnerships Ahead of Summit",
    source: "Decrypt",
    published_at: new Date().toISOString(),
    url: "https://example.com/news/4"
  },
  {
    id: "news-5",
    title: "Regulators Eye Crypto Markets as Global Adoption Increases",
    source: "Bloomberg",
    published_at: new Date().toISOString(),
    url: "https://example.com/news/5"
  }
];

// Get trending coins
export const getTrendingCoins = async (): Promise<CoinOption[]> => {
  // In a real implementation, you would fetch from an API
  // For now, return mock data
  return mockTrendingCoins;
};

// Get latest news
export const getLatestNews = async (): Promise<any[]> => {
  // In a real implementation, you would fetch from an API
  // For now, return mock data
  return mockNewsItems;
};

// Search for coins
export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  // In a real implementation, you would search via an API
  // For now, filter the mock data
  return mockTrendingCoins.filter(coin => 
    coin.name.toLowerCase().includes(query.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(query.toLowerCase())
  );
};

// Get market data for a specific coin
export const getCoinData = async (coinId: string): Promise<CryptoData | null> => {
  // In a real implementation, you would fetch from an API
  // For now, find in mock data
  const coin = mockTrendingCoins.find(c => c.id === coinId);
  
  if (!coin) return null;
  
  return {
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    price: coin.price,
    priceChange: coin.priceChange,
    changePercent: coin.changePercent,
    image: coin.image,
    marketCap: coin.marketCap,
    volume: coin.volume
  };
};

// Get historical price data for a coin
export const getCoinHistoricalData = async (
  coinId: string, 
  days: number = 30
): Promise<any[]> => {
  // In a real implementation, you would fetch from an API
  // For now, generate some random data points
  const dataPoints = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    dataPoints.push({
      date: date.toISOString().split('T')[0],
      price: 30000 + Math.random() * 20000,
      volume: 20000000000 + Math.random() * 10000000000
    });
  }
  
  return dataPoints;
};

// Get currency exchange rates
export const getExchangeRates = async (): Promise<any> => {
  // In a real implementation, you would fetch from an API
  // For now, return mock exchange rates
  return {
    AUD: 1.53,
    EUR: 0.93,
    GBP: 0.79,
    JPY: 147.21,
    CAD: 1.36,
    CNY: 7.24
  };
};
