
import { CoinOption } from "@/types/trading";
import { mockCoinData } from "@/utils/mockData";

// Fetch available cryptocurrency options
export const fetchCoinOptions = async (): Promise<CoinOption[]> => {
  // In a real app, this would be an API call to fetch available coins
  // For now, we'll just use our mock data with a simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCoinData);
    }, 500);
  });
};

// Get real-time price for a specific coin
export const fetchCoinPrice = async (coinId: string): Promise<number> => {
  // In a real app, this would be an API call to get the current price
  // For now, we'll just use our mock data
  const coin = mockCoinData.find(c => c.id === coinId);
  
  if (coin) {
    // Add a small random price variation to simulate real-time changes
    const variation = coin.price * (Math.random() * 0.01 - 0.005); // ±0.5%
    return coin.price + variation;
  }
  
  throw new Error(`Coin with ID ${coinId} not found`);
};

// Search coins by name or symbol
export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  if (!query || query.length < 2) {
    return [];
  }
  
  const lowerQuery = query.toLowerCase();
  
  return mockCoinData.filter(coin => 
    coin.name.toLowerCase().includes(lowerQuery) || 
    coin.symbol.toLowerCase().includes(lowerQuery)
  );
};
