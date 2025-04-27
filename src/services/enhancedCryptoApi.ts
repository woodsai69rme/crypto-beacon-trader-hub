import { toast } from "@/components/ui/use-toast";
import { getMockCryptoData } from "./cryptoApi";
import apiCache from "./api/cacheService";
import { CryptoData, CryptoChartData } from "@/types/trading";
import { 
  fetchCoinsFromCoinGecko, 
  fetchCoinHistoryFromCoinGecko,
  searchCoinsFromCoinGecko 
} from "./api/coinGeckoService";
import { 
  fetchCoinsFromCryptoCompare, 
  fetchCoinHistoryFromCryptoCompare,
  fetchTechnicalIndicatorsFromCryptoCompare 
} from "./api/cryptoCompareService";

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
  
  try {
    const coins = await fetchWithFallback<CryptoData[]>(
      () => fetchCoinsFromCoinGecko(limit),
      () => fetchCoinsFromCryptoCompare(limit),
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
  
  try {
    const data = await fetchWithFallback<CryptoChartData>(
      () => fetchCoinHistoryFromCoinGecko(coinId, days),
      () => fetchCoinHistoryFromCryptoCompare(coinId, days),
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
    const results = await searchCoinsFromCoinGecko(query);
    
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
    const data = await fetchTechnicalIndicatorsFromCryptoCompare(coinId, indicator);
    
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
export type { CryptoData, CryptoChartData } from "@/types/trading";

// Clear cache function for manual refreshes
export const clearApiCache = () => {
  apiCache.clear();
  toast({
    title: "Cache Cleared",
    description: "API cache has been cleared and fresh data will be loaded.",
  });
};
