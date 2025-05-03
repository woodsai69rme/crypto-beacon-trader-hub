
/**
 * Enhanced Crypto API service
 * Provides extended functionality for crypto data fetching with caching
 */

import { CoinOption, CryptoData, CryptoChartData } from "@/types/trading";

// Store API response cache
const apiCache: Record<string, { data: any; timestamp: number }> = {};

/**
 * Clear all stored API cache data
 * Useful for forcing fresh data fetches
 */
export const clearApiCache = () => {
  Object.keys(apiCache).forEach((key) => {
    delete apiCache[key];
  });
  console.log("API cache cleared successfully");
  return true;
};

/**
 * Fetch data with caching capability
 * @param url API endpoint URL 
 * @param cacheDuration Duration in milliseconds for cache validity
 */
export const fetchWithCache = async (url: string, cacheDuration = 5 * 60 * 1000) => {
  const now = Date.now();
  
  // Return cached data if valid
  if (apiCache[url] && now - apiCache[url].timestamp < cacheDuration) {
    return apiCache[url].data;
  }
  
  // Fetch fresh data
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Update cache
  apiCache[url] = { data, timestamp: now };
  
  return data;
};

/**
 * Search for coins based on query
 * @param query Search query string
 * @returns Array of matching coin options
 */
export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  // In real implementation, this would call an API endpoint
  // For now using mock data
  const mockCoins: CoinOption[] = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 68500, value: "bitcoin", label: "Bitcoin" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3280, value: "ethereum", label: "Ethereum" },
    { id: "solana", name: "Solana", symbol: "SOL", price: 148, value: "solana", label: "Solana" },
    { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.58, value: "cardano", label: "Cardano" },
    { id: "binancecoin", name: "BNB", symbol: "BNB", price: 580, value: "binancecoin", label: "BNB" },
    { id: "xrp", name: "XRP", symbol: "XRP", price: 0.61, value: "xrp", label: "XRP" },
    { id: "polkadot", name: "Polkadot", symbol: "DOT", price: 6.35, value: "polkadot", label: "Polkadot" },
  ];
  
  if (!query) return mockCoins.slice(0, 5);
  
  const filtered = mockCoins.filter(
    coin => coin.name.toLowerCase().includes(query.toLowerCase()) || 
            coin.symbol.toLowerCase().includes(query.toLowerCase())
  );
  
  return filtered.slice(0, 5);
};

/**
 * Fetch detailed chart data for a coin
 * @param coinId Coin identifier
 * @param days Number of days of history to fetch
 * @returns Chart data with prices, volumes and market caps
 */
export const fetchCoinChartData = async (coinId: string, days = 7): Promise<CryptoChartData> => {
  // In a real app, this would call the actual API
  // For now, generate mock data
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const prices: [number, number][] = [];
  const market_caps: [number, number][] = [];
  const total_volumes: [number, number][] = [];
  
  // Generate mock data points for the requested number of days
  let basePrice = coinId === 'bitcoin' ? 68000 : coinId === 'ethereum' ? 3200 : 100;
  let baseMarketCap = coinId === 'bitcoin' ? 1300000000000 : coinId === 'ethereum' ? 390000000000 : 10000000000;
  let baseVolume = coinId === 'bitcoin' ? 28000000000 : coinId === 'ethereum' ? 12000000000 : 1000000000;
  
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * oneDayMs);
    
    // Add some random variation to simulate price movements
    const priceChange = (Math.random() - 0.5) * 0.05; // +/- 5% max daily change
    basePrice = basePrice * (1 + priceChange);
    baseMarketCap = baseMarketCap * (1 + priceChange);
    baseVolume = baseVolume * (1 + (Math.random() - 0.5) * 0.2); // Volumes vary more
    
    prices.push([timestamp, basePrice]);
    market_caps.push([timestamp, baseMarketCap]);
    total_volumes.push([timestamp, baseVolume]);
  }
  
  return {
    prices,
    market_caps,
    total_volumes
  };
};
