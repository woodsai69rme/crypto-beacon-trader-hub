
import axios from "axios";
import { CryptoData, CryptoChartData, CoinOption } from "@/types/trading";

// API endpoints
const COINGECKO_API = "https://api.coingecko.com/api/v3";
const CRYPTOCOMPARE_API = "https://min-api.cryptocompare.com/data";

// Cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute

// Function to fetch data with caching
const fetchWithCache = async (url: string, params?: Record<string, string>) => {
  const cacheKey = `${url}?${new URLSearchParams(params).toString()}`;
  
  // Check cache first
  const cachedData = apiCache.get(cacheKey);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }
  
  try {
    const response = await axios.get(url, { params });
    // Store in cache
    apiCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

// Clear the API cache
export const clearApiCache = () => {
  apiCache.clear();
};

// Fetch crypto market data
export const fetchMarketData = async (
  currency: string = "usd",
  perPage: number = 100,
  page: number = 1,
  sparkline: boolean = false
): Promise<CryptoData[]> => {
  try {
    const endpoint = `${COINGECKO_API}/coins/markets`;
    const params = {
      vs_currency: currency,
      per_page: perPage.toString(),
      page: page.toString(),
      sparkline: sparkline.toString(),
      order: "market_cap_desc",
    };
    
    return await fetchWithCache(endpoint, params);
  } catch (error) {
    console.error("Error fetching market data:", error);
    throw error;
  }
};

// Fetch crypto chart data
export const fetchCryptoChartData = async (
  coinId: string,
  days: string = "7",
  currency: string = "usd"
): Promise<CryptoChartData> => {
  try {
    const endpoint = `${COINGECKO_API}/coins/${coinId}/market_chart`;
    const params = {
      vs_currency: currency,
      days,
    };
    
    return await fetchWithCache(endpoint, params);
  } catch (error) {
    console.error(`Error fetching chart data for ${coinId}:`, error);
    throw error;
  }
};

// Search for coins
export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  try {
    const endpoint = `${COINGECKO_API}/search`;
    const response = await axios.get(endpoint, { params: { query } });
    
    // Map API response to CoinOption format
    return response.data.coins.slice(0, 10).map((coin: any) => ({
      value: coin.id,
      label: `${coin.name} (${coin.symbol.toUpperCase()})`,
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.large || coin.thumb,
    }));
  } catch (error) {
    console.error("Error searching coins:", error);
    throw error;
  }
};

// Fetch coin details
export const fetchCoinDetails = async (coinId: string): Promise<any> => {
  try {
    const endpoint = `${COINGECKO_API}/coins/${coinId}`;
    const params = {
      localization: "false",
      tickers: "false",
      market_data: "true",
      community_data: "false",
      developer_data: "false",
    };
    
    return await fetchWithCache(endpoint, params);
  } catch (error) {
    console.error(`Error fetching details for ${coinId}:`, error);
    throw error;
  }
};

// Fetch crypto data (general-purpose function for components like Watchlist)
export const fetchCryptoData = async (
  coinIds: string[],
  currency: string = "usd"
): Promise<CryptoData[]> => {
  try {
    if (!coinIds.length) return [];
    
    const endpoint = `${COINGECKO_API}/coins/markets`;
    const params = {
      vs_currency: currency,
      ids: coinIds.join(','),
      order: "market_cap_desc",
      per_page: coinIds.length.toString(),
      page: "1",
      sparkline: "false",
    };
    
    return await fetchWithCache(endpoint, params);
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    return [];
  }
};

// Fetch historical price data
export const fetchHistoricalPrices = async (
  coinId: string,
  days: number = 30,
  currency: string = "usd"
): Promise<any> => {
  try {
    const endpoint = `${COINGECKO_API}/coins/${coinId}/market_chart`;
    const params = {
      vs_currency: currency,
      days: days.toString(),
    };
    
    const data = await fetchWithCache(endpoint, params);
    return data.prices.map((priceData: [number, number]) => ({
      timestamp: priceData[0],
      price: priceData[1],
    }));
  } catch (error) {
    console.error(`Error fetching historical prices for ${coinId}:`, error);
    throw error;
  }
};

// Fetch exchange rates for currency conversion
export const fetchExchangeRates = async (): Promise<Record<string, number>> => {
  try {
    const endpoint = `${COINGECKO_API}/exchange_rates`;
    const data = await fetchWithCache(endpoint);
    
    // Convert to a more usable format
    const rates: Record<string, number> = {};
    for (const [key, value] of Object.entries(data.rates)) {
      rates[key] = (value as any).value;
    }
    
    return rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    throw error;
  }
};

// Fetch price comparison from CryptoCompare
export const fetchPriceComparison = async (
  baseCoin: string,
  quoteCoin: string,
  limit: number = 30
): Promise<any> => {
  try {
    const endpoint = `${CRYPTOCOMPARE_API}/v2/histoday`;
    const params = {
      fsym: baseCoin.toUpperCase(),
      tsym: quoteCoin.toUpperCase(),
      limit: limit.toString(),
    };
    
    const data = await fetchWithCache(endpoint, params);
    return data.Data.Data;
  } catch (error) {
    console.error(`Error fetching price comparison for ${baseCoin}/${quoteCoin}:`, error);
    throw error;
  }
};

// Helper to check if the CoinGecko API is working
export const checkApiStatus = async (): Promise<boolean> => {
  try {
    const endpoint = `${COINGECKO_API}/ping`;
    await axios.get(endpoint);
    return true;
  } catch (error) {
    console.error("CoinGecko API might be down:", error);
    return false;
  }
};
