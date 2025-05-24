
import { CoinOption, NewsItem } from '@/types/trading';

// Enhanced crypto API service with multiple data sources
export const getTrendingCoins = async (): Promise<CoinOption[]> => {
  // Mock trending coins data
  const mockTrendingCoins: CoinOption[] = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 58352.12 + (Math.random() * 2000 - 1000),
      priceChange: 1245.32 + (Math.random() * 200 - 100),
      changePercent: 2.18 + (Math.random() * 2 - 1),
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
      price: 3105.78 + (Math.random() * 300 - 150),
      priceChange: 65.43 + (Math.random() * 50 - 25),
      changePercent: 2.15 + (Math.random() * 2 - 1),
      marketCap: 373952067386,
      volume: 21891456789,
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      value: "ethereum",
      label: "Ethereum (ETH)"
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL", 
      price: 143.87 + (Math.random() * 20 - 10),
      priceChange: 7.23 + (Math.random() * 5 - 2.5),
      changePercent: 5.29 + (Math.random() * 2 - 1),
      marketCap: 63287612543,
      volume: 3691845721,
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      value: "solana",
      label: "Solana (SOL)"
    }
  ];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockTrendingCoins;
};

export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  // Mock search functionality
  const allCoins: CoinOption[] = [
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
    }
  ];

  // Filter based on query
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  return allCoins.filter(
    coin => coin.name.toLowerCase().includes(lowerQuery) || 
            coin.symbol.toLowerCase().includes(lowerQuery) ||
            coin.id.toLowerCase().includes(lowerQuery)
  );
};

export const getLatestNews = async (): Promise<NewsItem[]> => {
  // Mock news data
  const mockNews: NewsItem[] = [
    {
      id: "1",
      title: "Bitcoin reaches new monthly high amid institutional adoption",
      summary: "Major financial institutions continue to add Bitcoin to their portfolios",
      url: "#",
      source: "CryptoNews",
      publishedAt: new Date(Date.now() - 60000).toISOString(),
      sentiment: "positive",
      relevance: 95,
      categories: ["Bitcoin", "Institutional"],
      coins: ["bitcoin"],
      isFake: false,
      confidence: 88
    },
    {
      id: "2", 
      title: "Ethereum upgrade shows promising scalability improvements",
      summary: "Network performance metrics show significant improvement post-upgrade",
      url: "#",
      source: "EthereumDaily",
      publishedAt: new Date(Date.now() - 180000).toISOString(),
      sentiment: "positive",
      relevance: 87,
      categories: ["Ethereum", "Technology"],
      coins: ["ethereum"],
      isFake: false,
      confidence: 92
    },
    {
      id: "3",
      title: "DeFi sector sees increased activity across multiple protocols", 
      summary: "Total value locked continues to grow with new innovative protocols",
      url: "#",
      source: "DeFiPulse",
      publishedAt: new Date(Date.now() - 300000).toISOString(),
      sentiment: "positive", 
      relevance: 78,
      categories: ["DeFi", "Protocols"],
      coins: ["ethereum", "solana"],
      isFake: false,
      confidence: 85
    }
  ];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return mockNews;
};

export default {
  getTrendingCoins,
  getLatestNews,
  searchCoins
};
