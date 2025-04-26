
import { toast } from "@/components/ui/use-toast";
import { CryptoData, CryptoChartData } from "./cryptoApi";

// Cache implementation
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number; // In milliseconds
}

class ApiCache {
  private cache: Map<string, CacheItem<any>> = new Map();
  
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.timestamp + item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }
  
  set<T>(key: string, data: T, expiry: number = 5 * 60 * 1000): void { // Default 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry
    });
  }
  
  clear(): void {
    this.cache.clear();
  }
}

const apiCache = new ApiCache();

// Primary API endpoints (CoinGecko)
const COINGECKO_API_BASE_URL = "https://api.coingecko.com/api/v3";
// Fallback API endpoints (CryptoCompare)
const CRYPTOCOMPARE_API_BASE_URL = "https://min-api.cryptocompare.com/data";

// Utility function to handle API errors with fallbacks
async function fetchWithFallback<T>(
  primaryFetch: () => Promise<T>,
  fallbackFetch: () => Promise<T>,
  errorMessage: string
): Promise<T> {
  try {
    return await primaryFetch();
  } catch (primaryError) {
    console.error("Primary API failed:", primaryError);
    
    try {
      // Log fallback usage for analytics
      console.log("Using fallback API");
      return await fallbackFetch();
    } catch (fallbackError) {
      console.error("Fallback API failed:", fallbackError);
      toast({
        title: "API Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  }
}

// Enhanced version of fetchTopCoins with caching and fallback
export const fetchTopCoins = async (limit: number = 20): Promise<CryptoData[]> => {
  const cacheKey = `topCoins-${limit}`;
  const cachedData = apiCache.get<CryptoData[]>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  const fetchFromCoinGecko = async (): Promise<CryptoData[]> => {
    const response = await fetch(
      `${COINGECKO_API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch cryptocurrency data from CoinGecko");
    }
    
    return await response.json();
  };
  
  const fetchFromCryptoCompare = async (): Promise<CryptoData[]> => {
    // CryptoCompare requires different formatting than CoinGecko
    const response = await fetch(
      `${CRYPTOCOMPARE_API_BASE_URL}/top/mktcapfull?limit=${limit}&tsym=USD`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch cryptocurrency data from CryptoCompare");
    }
    
    const data = await response.json();
    
    // Transform to match our CryptoData interface
    return data.Data.map((item: any) => ({
      id: item.CoinInfo.Name.toLowerCase(),
      name: item.CoinInfo.FullName,
      symbol: item.CoinInfo.Name,
      current_price: item.RAW?.USD?.PRICE || 0,
      market_cap: item.RAW?.USD?.MKTCAP || 0,
      market_cap_rank: item.CoinInfo.SortOrder,
      price_change_percentage_24h: item.RAW?.USD?.CHANGEPCT24HOUR || 0,
      image: `https://www.cryptocompare.com${item.CoinInfo.ImageUrl}`,
      ath: item.RAW?.USD?.HIGHDAY || 0,
      total_volume: item.RAW?.USD?.TOTALVOLUME24H || 0,
      circulating_supply: item.RAW?.USD?.SUPPLY || 0
    }));
  };
  
  try {
    const coins = await fetchWithFallback<CryptoData[]>(
      fetchFromCoinGecko,
      fetchFromCryptoCompare,
      "Failed to fetch cryptocurrency data"
    );
    
    // Get AUD conversion rate and add AUD prices
    const conversionResponse = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=AUD");
    let audRate = 1.45; // Default fallback rate
    
    if (conversionResponse.ok) {
      const rateData = await conversionResponse.json();
      audRate = rateData.rates.AUD || audRate;
    }
    
    // Add AUD prices to the coin data
    const coinsWithAUD = coins.map((coin: any) => ({
      ...coin,
      priceAUD: coin.current_price * audRate
    }));
    
    // Cache the result
    apiCache.set(cacheKey, coinsWithAUD, 2 * 60 * 1000); // 2 minutes cache
    
    return coinsWithAUD;
  } catch (error) {
    console.error("API Error:", error);
    return getMockCryptoData(limit);
  }
};

// Enhanced version of fetchCoinHistory with caching and fallback
export const fetchCoinHistory = async (
  coinId: string, 
  days: number = 7
): Promise<CryptoChartData | null> => {
  const cacheKey = `coinHistory-${coinId}-${days}`;
  const cachedData = apiCache.get<CryptoChartData>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  const fetchFromCoinGecko = async (): Promise<CryptoChartData> => {
    const response = await fetch(
      `${COINGECKO_API_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch coin history from CoinGecko");
    }
    
    return await response.json();
  };
  
  const fetchFromCryptoCompare = async (): Promise<CryptoChartData> => {
    // For CryptoCompare, we need to map days to hours and get historical data
    const hours = days * 24;
    const limit = Math.min(hours, 2000); // API limit
    const response = await fetch(
      `${CRYPTOCOMPARE_API_BASE_URL}/v2/histohour?fsym=${coinId.toUpperCase()}&tsym=USD&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch coin history from CryptoCompare");
    }
    
    const data = await response.json();
    
    // Transform to match CryptoChartData
    const prices: [number, number][] = data.Data.Data.map((item: any) => [
      item.time * 1000, // Convert to milliseconds
      item.close
    ]);
    
    return {
      prices,
      market_caps: [], // CryptoCompare doesn't provide this
      total_volumes: [] // CryptoCompare doesn't provide this
    };
  };
  
  try {
    const data = await fetchWithFallback<CryptoChartData>(
      fetchFromCoinGecko,
      fetchFromCryptoCompare,
      `Failed to fetch history for ${coinId}`
    );
    
    // Cache the result
    apiCache.set(cacheKey, data, 5 * 60 * 1000); // 5 minutes cache
    
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};

// Enhanced version of searchCoins with caching
export const searchCoins = async (query: string): Promise<CryptoData[]> => {
  if (!query || query.length < 2) return [];
  
  const cacheKey = `search-${query}`;
  const cachedData = apiCache.get<CryptoData[]>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const response = await fetch(`${COINGECKO_API_BASE_URL}/search?query=${query}`);
    
    if (!response.ok) {
      throw new Error("Search failed");
    }
    
    const data = await response.json();
    
    // Return the first 10 coins from the search results
    const results = data.coins.slice(0, 10).map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      market_cap_rank: coin.market_cap_rank || 9999,
      image: coin.large,
      // The search endpoint doesn't return these values, so we set defaults
      current_price: 0,
      market_cap: 0,
      price_change_percentage_24h: 0,
      ath: 0,
      total_volume: 0,
      circulating_supply: 0
    }));
    
    // Cache the result
    apiCache.set(cacheKey, results, 5 * 60 * 1000); // 5 minutes cache
    
    return results;
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
};

// Get Technical Indicators
export const fetchTechnicalIndicators = async (
  coinId: string,
  indicator: string
): Promise<any> => {
  const cacheKey = `indicator-${coinId}-${indicator}`;
  const cachedData = apiCache.get<any>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  try {
    // CryptoCompare provides technical indicators
    const endpoint = indicator.toLowerCase() === 'rsi' 
      ? 'rsi' 
      : indicator.toLowerCase() === 'macd' 
        ? 'macd' 
        : 'bbands'; // Default to Bollinger Bands
    
    const response = await fetch(
      `${CRYPTOCOMPARE_API_BASE_URL}/ta/${endpoint}?fsym=${coinId.toUpperCase()}&tsym=USD&limit=30`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${indicator} data`);
    }
    
    const data = await response.json();
    
    // Cache the result
    apiCache.set(cacheKey, data, 5 * 60 * 1000); // 5 minutes cache
    
    return data;
  } catch (error) {
    console.error("Technical Indicator API Error:", error);
    return null;
  }
};

// For backward compatibility
export { getMockCryptoData } from "./cryptoApi";

// Export types
export type { CryptoData, CryptoChartData } from "./cryptoApi";

// Clear cache function for manual refreshes
export const clearApiCache = () => {
  apiCache.clear();
  toast({
    title: "Cache Cleared",
    description: "API cache has been cleared and fresh data will be loaded.",
  });
};
