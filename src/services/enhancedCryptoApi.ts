
import { toast } from "@/components/ui/use-toast";
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
import { fetchCoinHistory } from "./cryptoApi";

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

// Mock data generator for when all APIs fail
const getMockCryptoData = (limit: number = 20): CryptoData[] => {
  const mockCoins: CryptoData[] = [];

  const baseCoins = [
    { name: "Bitcoin", symbol: "BTC", price: 58000, change: 2.3 },
    { name: "Ethereum", symbol: "ETH", price: 3100, change: -1.5 },
    { name: "Cardano", symbol: "ADA", price: 0.53, change: 5.2 },
    { name: "Solana", symbol: "SOL", price: 125, change: 8.7 },
    { name: "Ripple", symbol: "XRP", price: 0.58, change: -2.1 },
    { name: "Polkadot", symbol: "DOT", price: 7.2, change: 3.4 },
    { name: "Dogecoin", symbol: "DOGE", price: 0.08, change: 1.5 },
    { name: "Avalanche", symbol: "AVAX", price: 34, change: -3.2 },
    { name: "Chainlink", symbol: "LINK", price: 12.5, change: 4.8 },
    { name: "Polygon", symbol: "MATIC", price: 0.78, change: -1.2 },
  ];

  // Generate mock data based on the base coins
  for (let i = 0; i < Math.min(limit, baseCoins.length); i++) {
    const coin = baseCoins[i];
    const mcRank = i + 1;
    const volume = coin.price * (10000000 - i * 500000);
    const marketCap = coin.price * (1000000000 - i * 50000000);

    mockCoins.push({
      id: coin.name.toLowerCase(),
      symbol: coin.symbol.toLowerCase(),
      name: coin.name,
      image: `https://cryptologos.cc/logos/${coin.name.toLowerCase()}-${coin.symbol.toLowerCase()}-logo.png`,
      current_price: coin.price,
      market_cap: marketCap,
      market_cap_rank: mcRank,
      fully_diluted_valuation: marketCap * 1.2,
      total_volume: volume,
      high_24h: coin.price * (1 + 0.05),
      low_24h: coin.price * (1 - 0.05),
      price_change_24h: coin.price * (coin.change / 100),
      price_change_percentage_24h: coin.change,
      market_cap_change_24h: marketCap * (coin.change / 100),
      market_cap_change_percentage_24h: coin.change,
      circulating_supply: Math.floor(marketCap / coin.price),
      total_supply: Math.floor(marketCap / coin.price) * 1.5,
      max_supply: Math.floor(marketCap / coin.price) * 2,
      ath: coin.price * 2,
      ath_change_percentage: -50,
      ath_date: "2021-11-10T14:24:11.849Z",
      atl: coin.price * 0.2,
      atl_change_percentage: 400,
      atl_date: "2020-03-13T02:35:41.000Z",
      roi: null,
      last_updated: new Date().toISOString()
    });
  }

  return mockCoins;
};

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
export const fetchEnhancedCoinHistory = async (
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
export { fetchCoinHistory } from "./cryptoApi";

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
