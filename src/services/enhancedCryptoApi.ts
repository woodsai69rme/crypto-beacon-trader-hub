
// If this file doesn't exist or needs to be updated
import { CoinOption, NewsItem, CryptoData } from "@/types/trading";

// Mock data for development or fallback
const mockTrendingCoins: CoinOption[] = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 53000, priceChange: 2.3, changePercent: 2.3 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3100, priceChange: 1.7, changePercent: 1.7 },
  { id: "ripple", name: "XRP", symbol: "XRP", price: 0.51, priceChange: -0.8, changePercent: -0.8 },
  { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.42, priceChange: 3.2, changePercent: 3.2 },
  { id: "solana", name: "Solana", symbol: "SOL", price: 143, priceChange: 5.9, changePercent: 5.9 },
];

const mockNewsItems: NewsItem[] = [
  {
    id: "news-1",
    title: "Bitcoin Surpasses $50K Again as Market Sentiment Improves",
    source: "CoinDesk",
    timestamp: new Date().toISOString(),
    url: "https://www.coindesk.com"
  },
  {
    id: "news-2",
    title: "Ethereum 2.0 Upgrade Set for Next Month",
    source: "CryptoNews",
    timestamp: new Date().toISOString(),
    url: "https://www.cryptonews.com"
  },
  {
    id: "news-3",
    title: "Australian Regulators Consider New Crypto Framework",
    source: "Financial Review",
    timestamp: new Date().toISOString(),
    url: "https://www.afr.com"
  },
  {
    id: "news-4",
    title: "DeFi Projects See Record Growth in Q2",
    source: "Decrypt",
    timestamp: new Date().toISOString(),
    url: "https://decrypt.co"
  }
];

/**
 * Fetches trending cryptocurrencies
 * @returns Array of trending coins
 */
export const getTrendingCoins = async (): Promise<CoinOption[]> => {
  try {
    // In a real app, this would be an API call
    // const response = await fetch('https://api.example.com/trending-coins');
    // return await response.json();
    
    // Using mock data for now
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTrendingCoins;
  } catch (error) {
    console.error("Error fetching trending coins:", error);
    return mockTrendingCoins; // Return mock data as fallback
  }
};

/**
 * Fetches latest crypto news
 * @returns Array of news items
 */
export const getLatestNews = async (): Promise<NewsItem[]> => {
  try {
    // In a real app, this would be an API call
    // const response = await fetch('https://api.example.com/crypto-news');
    // return await response.json();
    
    // Using mock data for now
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockNewsItems;
  } catch (error) {
    console.error("Error fetching latest news:", error);
    return mockNewsItems; // Return mock data as fallback
  }
};

/**
 * Search coins by name or symbol
 * @param query Search query string
 * @returns Array of matching coins
 */
export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  try {
    // In a real app, this would be an API call with the query parameter
    // const response = await fetch(`https://api.example.com/search-coins?query=${query}`);
    // return await response.json();
    
    // Mock implementation - filter the mock data
    const filteredCoins = mockTrendingCoins.filter(coin => 
      coin.name.toLowerCase().includes(query.toLowerCase()) || 
      coin.symbol.toLowerCase().includes(query.toLowerCase())
    );
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return filteredCoins;
  } catch (error) {
    console.error("Error searching coins:", error);
    return []; // Return empty array as fallback
  }
};

/**
 * Fetch historical price data for a coin
 * @param coinId The ID of the coin
 * @param days Number of days of history to fetch
 * @returns Array of price data points
 */
export const fetchCoinHistory = async (coinId: string, days = 7) => {
  try {
    // In a real app, this would be an API call
    // const response = await fetch(`https://api.example.com/coins/${coinId}/history?days=${days}`);
    // return await response.json();
    
    // Mock implementation - generate random price history
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const startPrice = mockTrendingCoins.find(c => c.id === coinId)?.price || 1000;
    
    const priceHistory = Array.from({ length: days * 24 }, (_, i) => {
      const timestamp = new Date(now - (days * oneDayMs) + (i * oneDayMs / 24));
      // Generate slightly random price based on the starting price
      const randomFactor = 0.98 + (Math.random() * 0.04); // ±2%
      const price = startPrice * (1 + (i * 0.001)) * randomFactor;
      
      return {
        timestamp: timestamp.toISOString(),
        price
      };
    });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return priceHistory;
  } catch (error) {
    console.error("Error fetching coin history:", error);
    return []; // Return empty array as fallback
  }
};

// Export additional API functions as needed
