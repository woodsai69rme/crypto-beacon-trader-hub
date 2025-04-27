
import { toast } from "@/components/ui/use-toast";
import apiCache from "./cacheService";
import { CryptoData, CryptoChartData } from "../cryptoApi";

// API endpoints
const BASE_URL = "https://api.coingecko.com/api/v3";
const PRO_BASE_URL = "https://pro-api.coingecko.com/api/v3";

let apiKey: string | null = null;
let usePro: boolean = false;

// Set API key for Pro access
export function setCoinGeckoApiKey(key: string | null): void {
  if (key && key.trim()) {
    apiKey = key.trim();
    usePro = true;
    toast({
      title: "CoinGecko Pro API Key Set",
      description: "Using CoinGecko Pro API for data"
    });
  } else {
    apiKey = null;
    usePro = false;
    toast({
      title: "Using CoinGecko Free API",
      description: "API rate limits will apply"
    });
  }
}

// Helper function to build URL with API key if available
function buildUrl(endpoint: string, params: Record<string, string | number> = {}): string {
  const baseUrl = usePro ? PRO_BASE_URL : BASE_URL;
  
  // Convert params to query string
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, String(value));
  });
  
  const url = `${baseUrl}${endpoint}?${queryParams.toString()}`;
  return url;
}

// Helper function to make API requests with error handling
async function makeRequest<T>(endpoint: string, params: Record<string, string | number> = {}, cacheDuration = 5 * 60 * 1000): Promise<T> {
  const url = buildUrl(endpoint, params);
  const cacheKey = `coingecko-${endpoint}-${JSON.stringify(params)}`;
  
  // Try to get from cache first
  const cachedData = apiCache.get<T>(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const headers: HeadersInit = {
      'Accept': 'application/json'
    };
    
    // Add API key for Pro access
    if (usePro && apiKey) {
      headers['x-cg-pro-api-key'] = apiKey;
    }
    
    const response = await fetch(url, { headers });
    
    // Handle rate limiting and other errors
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("CoinGecko API rate limit exceeded");
      }
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json() as T;
    
    // Cache the result
    apiCache.set(cacheKey, data, cacheDuration);
    
    return data;
  } catch (error) {
    console.error("CoinGecko API error:", error);
    throw error;
  }
}

// Fetch top coins from CoinGecko
export async function fetchCoinsFromCoinGecko(limit: number = 20): Promise<CryptoData[]> {
  return makeRequest<CryptoData[]>('/coins/markets', {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: limit,
    page: 1,
    sparkline: false,
    locale: 'en'
  });
}

// Fetch historical data for a specific coin
export async function fetchCoinHistoryFromCoinGecko(coinId: string, days: number = 7): Promise<CryptoChartData> {
  return makeRequest<CryptoChartData>(`/coins/${coinId}/market_chart`, {
    vs_currency: 'usd',
    days: days
  });
}

// Search for coins by term
export async function searchCoinsFromCoinGecko(query: string): Promise<CryptoData[]> {
  if (!query || query.length < 2) return [];
  
  const searchResults = await makeRequest<{coins: any[]}>('/search', { query });
  
  if (!searchResults.coins || searchResults.coins.length === 0) {
    return [];
  }
  
  // Get top 10 results and fetch their details
  const coinIds = searchResults.coins.slice(0, 10).map(coin => coin.id).join(',');
  
  const detailedResults = await makeRequest<CryptoData[]>('/coins/markets', {
    vs_currency: 'usd',
    ids: coinIds,
    order: 'market_cap_desc',
    sparkline: false,
    locale: 'en'
  });
  
  return detailedResults;
}

// Get more detailed information about a specific coin
export async function fetchCoinDetails(coinId: string): Promise<any> {
  return makeRequest(`/coins/${coinId}`, {
    localization: false,
    tickers: false,
    market_data: true,
    community_data: false,
    developer_data: false,
    sparkline: false
  }, 15 * 60 * 1000); // Cache for 15 minutes
}

// Get global crypto market data
export async function fetchGlobalMarketData(): Promise<any> {
  return makeRequest('/global', {}, 10 * 60 * 1000); // Cache for 10 minutes
}

// Get trending coins
export async function fetchTrendingCoins(): Promise<any> {
  return makeRequest('/search/trending', {}, 60 * 60 * 1000); // Cache for 1 hour
}
