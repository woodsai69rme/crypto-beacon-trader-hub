
import { toast } from "@/components/ui/use-toast";
import apiCache from "./cacheService";
import { CryptoData, CryptoChartData } from "../cryptoApi";

// API endpoints
const BASE_URL = "https://pro-api.coinmarketcap.com/v1";

let apiKey: string | null = null;

// Set API key for CoinMarketCap API access
export function setCoinMarketCapApiKey(key: string | null): void {
  if (key && key.trim()) {
    apiKey = key.trim();
    toast({
      title: "CoinMarketCap API Key Set",
      description: "Using CoinMarketCap API for data"
    });
  } else {
    apiKey = null;
    toast({
      title: "CoinMarketCap API Key Removed",
      description: "API functionality will be limited",
      variant: "destructive"
    });
  }
}

// Helper function to build URL with API key
function buildUrl(endpoint: string, params: Record<string, string | number> = {}): string {
  // Convert params to query string
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, String(value));
  });
  
  const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;
  return url;
}

// Helper function to make API requests with error handling
async function makeRequest<T>(endpoint: string, params: Record<string, string | number> = {}, cacheDuration = 5 * 60 * 1000): Promise<T> {
  // Check if API key is available
  if (!apiKey) {
    throw new Error("CoinMarketCap API key is required");
  }
  
  const url = buildUrl(endpoint, params);
  const cacheKey = `coinmarketcap-${endpoint}-${JSON.stringify(params)}`;
  
  // Try to get from cache first
  const cachedData = apiCache.get<T>(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const response = await fetch(url, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json'
      }
    });
    
    // Handle errors
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("CoinMarketCap API rate limit exceeded");
      }
      throw new Error(`CoinMarketCap API error: ${response.status} ${response.statusText}`);
    }
    
    const responseData = await response.json();
    
    // CoinMarketCap always returns a data property
    if (responseData.status?.error_code) {
      throw new Error(`CoinMarketCap API error: ${responseData.status.error_message}`);
    }
    
    // Cache the result
    apiCache.set(cacheKey, responseData, cacheDuration);
    
    return responseData;
  } catch (error) {
    console.error("CoinMarketCap API error:", error);
    throw error;
  }
}

// Map CoinMarketCap format to our standard CryptoData format
function mapToCryptoData(data: any): CryptoData[] {
  if (!data || !data.data) return [];
  
  return data.data.map((item: any) => {
    const quote = item.quote?.USD || {};
    
    return {
      id: item.slug,
      symbol: item.symbol,
      name: item.name,
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${item.id}.png`,
      current_price: quote.price || 0,
      market_cap: quote.market_cap || 0,
      market_cap_rank: item.cmc_rank,
      fully_diluted_valuation: quote.fully_diluted_market_cap || null,
      total_volume: quote.volume_24h || 0,
      high_24h: null, // Not directly available
      low_24h: null, // Not directly available
      price_change_24h: quote.price_change_24h || 0,
      price_change_percentage_24h: quote.percent_change_24h || 0,
      market_cap_change_24h: quote.market_cap_change_24h || 0,
      market_cap_change_percentage_24h: quote.market_cap_change_percentage_24h || 0,
      circulating_supply: item.circulating_supply || 0,
      total_supply: item.total_supply || null,
      max_supply: item.max_supply || null,
      ath: null, // Not directly available
      ath_change_percentage: null, // Not directly available
      ath_date: null, // Not directly available
      atl: null, // Not directly available
      atl_change_percentage: null, // Not directly available
      atl_date: null, // Not directly available
      roi: null, // Not directly available
      last_updated: item.last_updated
    };
  });
}

// Fetch top coins from CoinMarketCap
export async function fetchCoinsFromCoinMarketCap(limit: number = 20): Promise<CryptoData[]> {
  const data = await makeRequest<any>('/cryptocurrency/listings/latest', {
    limit,
    convert: 'USD'
  });
  
  return mapToCryptoData(data);
}

// Get detailed information about specific coins by ID
export async function fetchCoinDetailsById(ids: string): Promise<any> {
  const data = await makeRequest<any>('/cryptocurrency/quotes/latest', {
    id: ids,
    convert: 'USD'
  }, 10 * 60 * 1000); // Cache for 10 minutes
  
  return data;
}

// Get detailed information about specific coins by symbol
export async function fetchCoinDetailsBySymbol(symbols: string): Promise<any> {
  const data = await makeRequest<any>('/cryptocurrency/quotes/latest', {
    symbol: symbols,
    convert: 'USD'
  }, 10 * 60 * 1000); // Cache for 10 minutes
  
  return data;
}

// Get latest global crypto metrics
export async function fetchGlobalMetrics(): Promise<any> {
  const data = await makeRequest<any>('/global-metrics/quotes/latest', {
    convert: 'USD'
  }, 15 * 60 * 1000); // Cache for 15 minutes
  
  return data;
}

// Get price conversion between cryptocurrencies
export async function convertCryptoPrices(amount: number, symbol: string, convert: string): Promise<any> {
  const data = await makeRequest<any>('/tools/price-conversion', {
    amount,
    symbol,
    convert
  }, 5 * 60 * 1000); // Cache for 5 minutes
  
  return data;
}

// Get trending cryptocurrencies
export async function getTrendingCryptocurrencies(): Promise<any> {
  // Since CoinMarketCap doesn't have a dedicated trending endpoint,
  // we can use the top gainers as a proxy for trending coins
  const data = await makeRequest<any>('/cryptocurrency/listings/latest', {
    limit: 10,
    convert: 'USD',
    sort: 'percent_change_24h',
    sort_dir: 'desc'
  }, 30 * 60 * 1000); // Cache for 30 minutes
  
  return data;
}
