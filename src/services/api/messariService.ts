import { toast } from "@/components/ui/use-toast";
import apiCache from "./cacheService";
import { CryptoData, CryptoChartData } from "@/types/trading";

// API endpoints
const BASE_URL = "https://data.messari.io/api/v1";
const PRO_BASE_URL = "https://data.messari.io/api/v2";

let apiKey: string | null = null;
let usePro: boolean = false;

// Set API key for Pro access
export function setMessariApiKey(key: string | null): void {
  if (key && key.trim()) {
    apiKey = key.trim();
    usePro = true;
    toast({
      title: "Messari Pro API Key Set",
      description: "Using Messari Pro API for enhanced data access"
    });
  } else {
    apiKey = null;
    usePro = false;
    toast({
      title: "Using Messari Public API",
      description: "API access will be limited"
    });
  }
}

// Helper function to build URL with correct base URL
function buildUrl(endpoint: string, params: Record<string, string | number> = {}): string {
  const baseUrl = usePro ? PRO_BASE_URL : BASE_URL;
  
  // Convert params to query string
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, String(value));
  });
  
  const url = `${baseUrl}${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return url;
}

// Helper function to make API requests with error handling
async function makeRequest<T>(endpoint: string, params: Record<string, string | number> = {}, cacheDuration = 5 * 60 * 1000): Promise<T> {
  const url = buildUrl(endpoint, params);
  const cacheKey = `messari-${endpoint}-${JSON.stringify(params)}`;
  
  // Try to get from cache first
  const cachedData = apiCache.get<T>(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const headers: HeadersInit = {
      'Accept': 'application/json'
    };
    
    // Add API key if available
    if (apiKey) {
      headers['x-messari-api-key'] = apiKey;
    }
    
    const response = await fetch(url, { headers });
    
    // Handle rate limiting and other errors
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Messari API rate limit exceeded");
      }
      throw new Error(`Messari API error: ${response.status} ${response.statusText}`);
    }
    
    const responseData = await response.json();
    
    // Check if there's an error in the response
    if (responseData.status && responseData.status.error_code) {
      throw new Error(`Messari API error: ${responseData.status.error_message}`);
    }
    
    // Cache the result
    apiCache.set(cacheKey, responseData, cacheDuration);
    
    return responseData;
  } catch (error) {
    console.error("Messari API error:", error);
    throw error;
  }
}

// Map Messari format to our standard CryptoData format
function mapToCryptoData(data: any): CryptoData[] {
  if (!data || !data.data) return [];
  
  return data.data.map((asset: any) => {
    const metrics = asset.metrics;
    
    return {
      id: asset.slug,
      symbol: asset.symbol,
      name: asset.name,
      image: `https://messari.io/asset-images/${asset.id}/64.png?v=2`,
      current_price: metrics?.market_data?.price_usd || 0,
      market_cap: metrics?.marketcap?.current_marketcap_usd || 0,
      market_cap_rank: metrics?.marketcap?.rank || null,
      fully_diluted_valuation: metrics?.marketcap?.fully_diluted_marketcap_usd || null,
      total_volume: metrics?.market_data?.volume_last_24_hours || 0,
      high_24h: null, // Not directly available
      low_24h: null, // Not directly available
      price_change_24h: null, // Calculate from percent change
      price_change_percentage_24h: metrics?.market_data?.percent_change_usd_last_24_hours || 0,
      market_cap_change_24h: null, // Not directly available
      market_cap_change_percentage_24h: null, // Not directly available
      circulating_supply: metrics?.supply?.circulating || null,
      total_supply: metrics?.supply?.total || null,
      max_supply: metrics?.supply?.max || null,
      ath: null, // Not directly available
      ath_change_percentage: null, // Not directly available
      ath_date: null, // Not directly available
      atl: null, // Not directly available
      atl_change_percentage: null, // Not directly available
      atl_date: null, // Not directly available
      roi: null, // Not directly available
      last_updated: asset.updated_at
    };
  });
}

// Convert Messari time-series data to our format
function mapToChartData(data: any): CryptoChartData {
  if (!data || !data.data || !data.data.values) {
    return { prices: [], market_caps: [], total_volumes: [] };
  }
  
  const values = data.data.values;
  const prices: [number, number][] = [];
  const market_caps: [number, number][] = [];
  const total_volumes: [number, number][] = [];
  
  values.forEach((point: any) => {
    const timestamp = new Date(point[0]).getTime();
    const price = point[1] || 0;
    const marketCap = point[2] || 0;
    const volume = point[3] || 0;
    
    prices.push([timestamp, price]);
    market_caps.push([timestamp, marketCap]);
    total_volumes.push([timestamp, volume]);
  });
  
  return { prices, market_caps, total_volumes };
}

// Fetch top assets from Messari
export async function fetchAssetsFromMessari(limit: number = 20): Promise<CryptoData[]> {
  const endpoint = '/assets';
  
  const data = await makeRequest<any>(endpoint, {
    limit,
    fields: 'id,name,slug,symbol,metrics/market_data,metrics/marketcap,metrics/supply'
  });
  
  return mapToCryptoData(data);
}

// Fetch detailed data for a specific asset
export async function fetchAssetDetails(assetKey: string): Promise<any> {
  const endpoint = `/assets/${assetKey}/metrics`;
  return makeRequest<any>(endpoint, {}, 15 * 60 * 1000); // Cache for 15 minutes
}

// Fetch historical time-series data for an asset
export async function fetchAssetTimeSeries(
  assetKey: string,
  metricId: string = 'price',
  interval: string = '1d',
  days: number = 30
): Promise<CryptoChartData> {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  
  const startFormatted = start.toISOString().split('T')[0];
  const endFormatted = end.toISOString().split('T')[0];
  
  const endpoint = `/assets/${assetKey}/metrics/${metricId}/time-series`;
  
  const data = await makeRequest<any>(endpoint, {
    interval,
    start: startFormatted,
    end: endFormatted
  });
  
  return mapToChartData(data);
}

// Fetch market data for all assets
export async function fetchMarketData(page: number = 1, limit: number = 20): Promise<any> {
  const endpoint = '/markets';
  return makeRequest<any>(endpoint, { page, limit }, 10 * 60 * 1000); // Cache for 10 minutes
}

// Fetch news articles
export async function fetchNews(page: number = 1, limit: number = 20): Promise<any> {
  const endpoint = '/news';
  return makeRequest<any>(endpoint, { page, limit }, 20 * 60 * 1000); // Cache for 20 minutes
}

// Fetch asset profiles (requires Pro API key)
export async function fetchAssetProfile(assetKey: string): Promise<any> {
  if (!usePro) {
    throw new Error("Messari Pro API key required for asset profiles");
  }
  
  const endpoint = `/assets/${assetKey}/profile`;
  return makeRequest<any>(endpoint, {}, 60 * 60 * 1000); // Cache for 1 hour
}

// Fetch on-chain metrics (requires Pro API key)
export async function fetchOnChainMetrics(assetKey: string): Promise<any> {
  if (!usePro) {
    throw new Error("Messari Pro API key required for on-chain metrics");
  }
  
  const endpoint = `/assets/${assetKey}/metrics/blockchain`;
  return makeRequest<any>(endpoint, {}, 30 * 60 * 1000); // Cache for 30 minutes
}
