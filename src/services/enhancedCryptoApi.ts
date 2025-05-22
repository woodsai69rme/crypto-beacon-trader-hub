
import { CoinOption, NewsItem } from "@/types/trading";

// Mock data for trending coins
const mockTrendingCoins: CoinOption[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    price: 63542.12,
    priceChange: 1245.32,
    changePercent: 2.3,
    volume: 28000000000,
    marketCap: 1180000000000,
    value: "bitcoin",
    label: "Bitcoin"
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    price: 3245.87,
    priceChange: 65.21,
    changePercent: 1.8,
    volume: 12000000000,
    marketCap: 380000000000,
    value: "ethereum",
    label: "Ethereum"
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    price: 143.21,
    priceChange: -5.67,
    changePercent: -3.2,
    volume: 4500000000,
    marketCap: 58000000000,
    value: "solana",
    label: "Solana"
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    price: 0.42,
    priceChange: -0.02,
    changePercent: -2.1,
    volume: 720000000,
    marketCap: 14500000000,
    value: "cardano",
    label: "Cardano"
  },
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    price: 6.45,
    priceChange: 0.32,
    changePercent: 4.5,
    volume: 450000000,
    marketCap: 7800000000,
    value: "polkadot",
    label: "Polkadot"
  }
];

// Mock data for news items
const mockNewsItems = [
  {
    id: "news-1",
    title: "Bitcoin Surpasses $63,000 as Institutional Adoption Grows",
    source: "CoinDesk",
    published_at: new Date(Date.now() - 3600000).toISOString(),
    url: "https://coindesk.com/btc-rises",
  },
  {
    id: "news-2",
    title: "Ethereum 2.0 Upgrade Timeline Announced for Q3",
    source: "CryptoNews",
    published_at: new Date(Date.now() - 7200000).toISOString(),
    url: "https://cryptonews.com/eth-upgrade",
  },
  {
    id: "news-3",
    title: "Australian Regulatory Body Introduces New Crypto Framework",
    source: "CoinTelegraph",
    published_at: new Date(Date.now() - 10800000).toISOString(),
    url: "https://cointelegraph.com/aus-regulations",
  },
  {
    id: "news-4",
    title: "Solana DeFi Ecosystem Shows Strong Growth in Q2",
    source: "DeFi Pulse",
    published_at: new Date(Date.now() - 14400000).toISOString(),
    url: "https://defipulse.com/solana-growth",
  },
  {
    id: "news-5",
    title: "Major Australian Bank Announces Crypto Trading Services",
    source: "Blockchain News",
    published_at: new Date(Date.now() - 18000000).toISOString(),
    url: "https://blockchainnews.com/aus-bank-crypto",
  }
];

// Function to get trending coins
export const getTrendingCoins = async (): Promise<CoinOption[]> => {
  // In a real app, this would be an API call
  // For now, we'll just return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTrendingCoins);
    }, 300);
  });
};

// Function to get latest news
export const getLatestNews = async (): Promise<any[]> => {
  // In a real app, this would be an API call
  // For now, we'll just return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNewsItems);
    }, 300);
  });
};

// Function to search for coins by name or symbol
export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  // In a real app, this would be an API call
  // For now, we'll just filter our mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredCoins = mockTrendingCoins.filter(coin => 
        coin.name.toLowerCase().includes(query.toLowerCase()) || 
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filteredCoins);
    }, 300);
  });
};
