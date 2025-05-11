
import { CoinOption } from "@/types/trading";
import { mockCryptoData } from "@/components/MarketCorrelations/mockData";

// Get trending coins (simulated)
export const getTrendingCoins = async (): Promise<CoinOption[]> => {
  // In a real app, this would fetch from an API
  // For now, we'll use the mock data
  const sortedByVolume = [...mockCryptoData]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 6)
    .map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price,
      priceChange: coin.priceChange,
      changePercent: coin.changePercent,
      image: coin.image,
      volume: coin.volume,
      marketCap: coin.marketCap,
      value: coin.id,
      label: coin.name
    }));
    
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return sortedByVolume;
};

// Get latest news (simulated)
export const getLatestNews = async (): Promise<any[]> => {
  // In a real app, this would fetch from a news API
  const mockNews = [
    {
      id: "1",
      title: "Bitcoin Surges Past $61,000 as Institutional Adoption Grows",
      source: "CryptoNews",
      publishedAt: new Date().toISOString()
    },
    {
      id: "2",
      title: "Ethereum 2.0 Upgrade on Track for Q3 Release",
      source: "BlockchainReport",
      publishedAt: new Date().toISOString()
    },
    {
      id: "3",
      title: "Major Bank Announces Cryptocurrency Custody Services",
      source: "FinanceDaily",
      publishedAt: new Date().toISOString()
    },
    {
      id: "4",
      title: "New Regulatory Framework for Digital Assets Proposed",
      source: "CryptoInsider",
      publishedAt: new Date().toISOString()
    },
    {
      id: "5",
      title: "DeFi Market Cap Exceeds $100 Billion for First Time",
      source: "DeFiPulse",
      publishedAt: new Date().toISOString()
    }
  ];
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockNews;
};

// Search for coins by name or symbol
export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  // In a real app, this would call an API endpoint
  // For now, we'll filter the mock data
  const normalizedQuery = query.toLowerCase();
  
  const filteredCoins = mockCryptoData
    .filter(coin => 
      coin.name.toLowerCase().includes(normalizedQuery) || 
      coin.symbol.toLowerCase().includes(normalizedQuery)
    )
    .map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price,
      priceChange: coin.priceChange,
      changePercent: coin.changePercent,
      image: coin.image,
      volume: coin.volume,
      marketCap: coin.marketCap,
      value: coin.id,
      label: coin.name
    }));
    
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return filteredCoins;
};

// Get historical price data for a specific coin
export const getCoinHistory = async (coinId: string, days: number = 30): Promise<any> => {
  // In a real app, this would fetch from an API
  // For now, we'll generate mock historical data
  const dataPoints = days;
  const historyData: [number, number][] = [];
  
  let basePrice = 0;
  
  // Set different base prices based on coin
  if (coinId === 'bitcoin') {
    basePrice = 60000;
  } else if (coinId === 'ethereum') {
    basePrice = 3000;
  } else if (coinId === 'binancecoin') {
    basePrice = 500;
  } else {
    basePrice = 100;
  }
  
  // Generate historical price points with some volatility
  const now = Date.now();
  const oneDayMs = 86400000; // 24 hours in milliseconds
  
  for (let i = dataPoints; i >= 0; i--) {
    const timestamp = now - (i * oneDayMs);
    const randomFactor = 0.05; // 5% maximum price movement per day
    const priceChange = (Math.random() * 2 - 1) * randomFactor * basePrice;
    basePrice += priceChange;
    historyData.push([timestamp, Math.max(0, basePrice)]);
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    prices: historyData,
    market_caps: historyData.map(([time, price]) => [time, price * 1000000 * (Math.random() * 0.2 + 0.9)]),
    total_volumes: historyData.map(([time, price]) => [time, price * 10000 * (Math.random() * 0.5 + 0.5)])
  };
};

// Get API usage statistics
export const getApiUsageStats = async (): Promise<any[]> => {
  // In a real app, this would fetch from an API management service
  // For now, we'll return mock data
  const mockApiStats = [
    {
      service: "CoinGecko",
      currentUsage: Math.floor(Math.random() * 450) + 50,
      maxUsage: 500,
      endpoint: "/coins/markets",
      resetTime: "1 hour"
    },
    {
      service: "CryptoCompare",
      currentUsage: Math.floor(Math.random() * 8500) + 1000,
      maxUsage: 10000,
      endpoint: "/data/pricemultifull",
      resetTime: "24 hours"
    },
    {
      service: "NewsAPI",
      currentUsage: Math.floor(Math.random() * 80) + 10,
      maxUsage: 100,
      endpoint: "/v2/everything",
      resetTime: "12 hours"
    }
  ];
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockApiStats;
};

// Export the full API
export default {
  getTrendingCoins,
  getLatestNews,
  searchCoins,
  getCoinHistory,
  getApiUsageStats
};
