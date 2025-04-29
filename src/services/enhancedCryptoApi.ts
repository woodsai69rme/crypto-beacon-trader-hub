
import { CryptoData, CoinOption } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";
import apiCache from "./api/cacheService";

// Cache keys
const CACHE_KEYS = {
  SEARCH: 'crypto-search',
  TRENDING: 'crypto-trending',
  TECHNICAL: 'technical-indicators',
};

// Base API URLs
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

// Default options for fetch
const DEFAULT_FETCH_OPTIONS = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};

/**
 * Search for cryptocurrencies by name or symbol
 */
export const searchCryptos = async (query: string): Promise<CryptoData[]> => {
  if (!query || query.length < 2) return [];
  
  const cacheKey = `${CACHE_KEYS.SEARCH}-${query}`;
  const cachedResult = apiCache.get<CryptoData[]>(cacheKey);
  
  if (cachedResult) {
    return cachedResult;
  }
  
  try {
    const response = await fetch(`${COINGECKO_API_URL}/search?query=${encodeURIComponent(query)}`, DEFAULT_FETCH_OPTIONS);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process and map the response to our interface
    const coins: CryptoData[] = data.coins.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.large,
      market_cap_rank: coin.market_cap_rank,
      price_change_24h: 0,
      price_change_percentage_24h: 0,
      market_cap: 0,
      current_price: 0,
      total_volume: 0,
      high_24h: 0,
      low_24h: 0,
      market_cap_change_24h: 0,
      market_cap_change_percentage_24h: 0,
      circulating_supply: 0,
      ath: 0,
      ath_change_percentage: 0,
      ath_date: "",
      atl: 0,
      atl_change_percentage: 0,
      atl_date: "",
      last_updated: new Date().toISOString()
    }));
    
    // Cache the results
    apiCache.set<CryptoData[]>(cacheKey, coins, 5 * 60 * 1000); // Cache for 5 minutes
    
    return coins;
  } catch (error) {
    console.error("Error searching cryptocurrencies:", error);
    toast({
      title: "Search Error",
      description: "Failed to search cryptocurrencies. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

/**
 * Get trending cryptocurrencies
 */
export const getTrendingCryptos = async (): Promise<CryptoData[]> => {
  const cacheKey = CACHE_KEYS.TRENDING;
  const cachedResult = apiCache.get<CryptoData[]>(cacheKey);
  
  if (cachedResult) {
    return cachedResult;
  }
  
  try {
    const response = await fetch(`${COINGECKO_API_URL}/search/trending`, DEFAULT_FETCH_OPTIONS);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map to consistent interface
    const trendingCoins: CryptoData[] = data.coins.map((item: any) => {
      const coin = item.item;
      return {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.large,
        market_cap_rank: coin.market_cap_rank,
        price_change_24h: 0,
        price_change_percentage_24h: 0,
        market_cap: 0,
        current_price: 0,
        total_volume: 0,
        high_24h: 0,
        low_24h: 0,
        market_cap_change_24h: 0,
        market_cap_change_percentage_24h: 0,
        circulating_supply: 0,
        ath: 0,
        ath_change_percentage: 0,
        ath_date: "",
        atl: 0,
        atl_change_percentage: 0,
        atl_date: "",
        last_updated: new Date().toISOString()
      };
    });
    
    // Cache the results
    apiCache.set<CryptoData[]>(cacheKey, trendingCoins, 30 * 60 * 1000); // Cache for 30 minutes
    
    return trendingCoins;
  } catch (error) {
    console.error("Error fetching trending cryptocurrencies:", error);
    toast({
      title: "API Error",
      description: "Failed to load trending cryptocurrencies.",
      variant: "destructive",
    });
    return [];
  }
};

/**
 * Fetch technical indicators for a cryptocurrency
 */
export const fetchTechnicalIndicators = async (coinId: string, days: number = 14) => {
  const cacheKey = `${CACHE_KEYS.TECHNICAL}-${coinId}-${days}`;
  const cachedResult = apiCache.get(cacheKey);
  
  if (cachedResult) {
    return cachedResult;
  }
  
  try {
    // In a real implementation, we would call a proper technical analysis API
    // For now, we'll generate mock data based on historical prices
    
    // First get price history
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      DEFAULT_FETCH_OPTIONS
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const prices = data.prices || [];
    
    // Calculate some basic indicators
    const closePrices = prices.map((item: [number, number]) => item[1]);
    
    // Mock RSI calculation
    const rsiValues = [];
    for (let i = 14; i < closePrices.length; i++) {
      // Simplified RSI calculation (not accurate, just for demonstration)
      const gains = [];
      const losses = [];
      
      for (let j = i - 14; j < i; j++) {
        const change = closePrices[j + 1] - closePrices[j];
        if (change >= 0) {
          gains.push(change);
          losses.push(0);
        } else {
          gains.push(0);
          losses.push(Math.abs(change));
        }
      }
      
      const avgGain = gains.reduce((sum, val) => sum + val, 0) / 14;
      const avgLoss = losses.reduce((sum, val) => sum + val, 0) / 14;
      
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      
      rsiValues.push({
        time: prices[i][0],
        value: rsi
      });
    }
    
    // Simple Moving Averages
    const sma20 = [];
    for (let i = 20; i < closePrices.length; i++) {
      const sum = closePrices.slice(i - 20, i).reduce((acc, val) => acc + val, 0);
      sma20.push({
        time: prices[i][0],
        value: sum / 20
      });
    }
    
    const sma50 = [];
    for (let i = 50; i < closePrices.length; i++) {
      const sum = closePrices.slice(i - 50, i).reduce((acc, val) => acc + val, 0);
      sma50.push({
        time: prices[i][0],
        value: sum / 50
      });
    }
    
    // MACD
    const ema12 = [];
    const ema26 = [];
    const macd = [];
    
    // Simplified EMA and MACD calculation
    let ema12Value = closePrices.slice(0, 12).reduce((sum, price) => sum + price, 0) / 12;
    let ema26Value = closePrices.slice(0, 26).reduce((sum, price) => sum + price, 0) / 26;
    
    for (let i = 0; i < closePrices.length; i++) {
      const multiplier12 = 2 / (12 + 1);
      const multiplier26 = 2 / (26 + 1);
      
      ema12Value = (closePrices[i] - ema12Value) * multiplier12 + ema12Value;
      if (i >= 11) {
        ema12.push({
          time: prices[i][0],
          value: ema12Value
        });
      }
      
      ema26Value = (closePrices[i] - ema26Value) * multiplier26 + ema26Value;
      if (i >= 25) {
        ema26.push({
          time: prices[i][0],
          value: ema26Value
        });
        
        macd.push({
          time: prices[i][0],
          value: ema12Value - ema26Value
        });
      }
    }
    
    const result = {
      prices: prices.map((item: [number, number]) => ({
        time: item[0],
        price: item[1]
      })),
      rsi: rsiValues,
      sma20,
      sma50,
      ema12,
      ema26,
      macd
    };
    
    // Cache the results
    apiCache.set(cacheKey, result, 60 * 60 * 1000); // Cache for 1 hour
    
    return result;
  } catch (error) {
    console.error("Error fetching technical indicators:", error);
    toast({
      title: "API Error",
      description: "Failed to load technical indicators.",
      variant: "destructive",
    });
    return {
      prices: [],
      rsi: [],
      sma20: [],
      sma50: [],
      ema12: [],
      ema26: [],
      macd: []
    };
  }
};

/**
 * Clear all cached API responses
 */
export const clearApiCache = () => {
  apiCache.clear();
  toast({
    title: "Cache Cleared",
    description: "All cached API responses have been cleared",
  });
};
