
import { toast } from "@/components/ui/use-toast";
import apiCache from "./cacheService";
import { CryptoData, CryptoChartData } from "../cryptoApi";

// API endpoints
const BASE_URL = "https://min-api.cryptocompare.com/data";

let apiKey: string | null = null;

// Set API key for enhanced access
export function setCryptoCompareApiKey(key: string | null): void {
  if (key && key.trim()) {
    apiKey = key.trim();
    toast({
      title: "CryptoCompare API Key Set",
      description: "Using enhanced CryptoCompare API access"
    });
  } else {
    apiKey = null;
    toast({
      title: "Using CryptoCompare Public API",
      description: "API rate limits will apply"
    });
  }
}

// Helper function to make API requests with error handling
async function makeRequest<T>(endpoint: string, params: Record<string, string | number> = {}, cacheDuration = 5 * 60 * 1000): Promise<T> {
  // Convert params to query string
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, String(value));
  });
  
  const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;
  const cacheKey = `cryptocompare-${endpoint}-${JSON.stringify(params)}`;
  
  // Try to get from cache first
  const cachedData = apiCache.get<T>(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const headers: HeadersInit = {};
    
    // Add API key if available
    if (apiKey) {
      headers['authorization'] = `Apikey ${apiKey}`;
    }
    
    const response = await fetch(url, { headers });
    
    // Handle errors
    if (!response.ok) {
      throw new Error(`CryptoCompare API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Check for API error response
    if (data.Response === 'Error') {
      throw new Error(`CryptoCompare API error: ${data.Message}`);
    }
    
    // Cache the result
    apiCache.set(cacheKey, data, cacheDuration);
    
    return data as T;
  } catch (error) {
    console.error("CryptoCompare API error:", error);
    throw error;
  }
}

// Map CryptoCompare format to our standard CryptoData format
function mapToCryptoData(data: any): CryptoData[] {
  if (!data || !data.Data) return [];
  
  return data.Data.map((item: any) => {
    const coin = item.CoinInfo;
    const price = item.RAW?.USD || {
      PRICE: 0,
      MKTCAP: 0,
      VOLUMEDAY: 0,
      CHANGEPCT24HOUR: 0,
      HIGH24HOUR: 0,
      LOW24HOUR: 0
    };
    
    return {
      id: coin.Name.toLowerCase(),
      symbol: coin.Name,
      name: coin.FullName,
      image: `https://www.cryptocompare.com${coin.ImageUrl}`,
      current_price: price.PRICE,
      market_cap: price.MKTCAP,
      market_cap_rank: coin.SortOrder,
      fully_diluted_valuation: price.MKTCAP,
      total_volume: price.VOLUMEDAY,
      high_24h: price.HIGH24HOUR,
      low_24h: price.LOW24HOUR,
      price_change_24h: price.PRICE * (price.CHANGEPCT24HOUR / 100),
      price_change_percentage_24h: price.CHANGEPCT24HOUR,
      market_cap_change_24h: 0, // Not directly available
      market_cap_change_percentage_24h: 0, // Not directly available
      circulating_supply: coin.CirculatingSupply,
      total_supply: coin.TotalCoinSupply > 0 ? coin.TotalCoinSupply : null,
      max_supply: coin.MaxSupply > 0 ? coin.MaxSupply : null,
      ath: 0, // Not directly available
      ath_change_percentage: 0, // Not directly available
      ath_date: "", // Not directly available
      atl: 0, // Not directly available
      atl_change_percentage: 0, // Not directly available
      atl_date: "", // Not directly available
      roi: null,
      last_updated: new Date().toISOString()
    };
  });
}

// Fetch top coins from CryptoCompare
export async function fetchCoinsFromCryptoCompare(limit: number = 20): Promise<CryptoData[]> {
  const data = await makeRequest<any>('/top/mktcapfull', {
    limit,
    tsym: 'USD'
  });
  
  return mapToCryptoData(data);
}

// Convert CryptoCompare historical data to our format
function mapToChartData(data: any): CryptoChartData {
  if (!data || !data.Data || !Array.isArray(data.Data.Data)) {
    return { prices: [], market_caps: [], total_volumes: [] };
  }
  
  const prices: [number, number][] = [];
  const market_caps: [number, number][] = [];
  const total_volumes: [number, number][] = [];
  
  data.Data.Data.forEach((item: any) => {
    const timestamp = item.time * 1000; // Convert to milliseconds
    prices.push([timestamp, item.close]);
    
    // CryptoCompare doesn't provide market cap in historical data
    // Using a placeholder value
    market_caps.push([timestamp, 0]);
    total_volumes.push([timestamp, item.volumeto]);
  });
  
  return { prices, market_caps, total_volumes };
}

// Fetch historical data for a specific coin
export async function fetchCoinHistoryFromCryptoCompare(coinId: string, days: number = 7): Promise<CryptoChartData> {
  // Determine appropriate aggregation based on days
  let aggregate = 1;
  let limit = days;
  
  if (days > 90) {
    aggregate = 24; // Daily data
    limit = days;
  } else if (days > 30) {
    aggregate = 12; // 12-hour data
    limit = days * 2;
  } else if (days > 7) {
    aggregate = 4; // 4-hour data
    limit = days * 6;
  } else {
    aggregate = 1; // Hourly data
    limit = days * 24;
  }
  
  const data = await makeRequest<any>('/v2/histohour', {
    fsym: coinId.toUpperCase(),
    tsym: 'USD',
    limit,
    aggregate
  });
  
  return mapToChartData(data);
}

// Fetch technical indicators from CryptoCompare
export async function fetchTechnicalIndicatorsFromCryptoCompare(coinId: string, indicator: string): Promise<any> {
  // Different endpoints based on indicator
  let endpoint = '/technical/price';
  let params: Record<string, string | number> = {
    fsym: coinId.toUpperCase(),
    tsym: 'USD',
  };
  
  switch (indicator.toLowerCase()) {
    case 'rsi':
      endpoint = '/technical/rsi';
      params.limit = 30;
      params.time = 14; // 14-period RSI
      break;
    case 'macd':
      endpoint = '/technical/macd';
      params.limit = 30;
      params.FastPeriod = 12;
      params.SlowPeriod = 26;
      params.SignalPeriod = 9;
      break;
    case 'ema':
      endpoint = '/technical/ema';
      params.limit = 30;
      params.time = 14;
      break;
    case 'sma':
      endpoint = '/technical/sma';
      params.limit = 30;
      params.time = 14;
      break;
    default:
      throw new Error(`Unsupported indicator: ${indicator}`);
  }
  
  return makeRequest(endpoint, params, 15 * 60 * 1000); // Cache for 15 minutes
}

// Get multiple prices at once
export async function fetchMultiplePrices(symbols: string[], currency: string = 'USD'): Promise<Record<string, number>> {
  if (symbols.length === 0) return {};
  
  const fsyms = symbols.map(s => s.toUpperCase()).join(',');
  const data = await makeRequest<any>('/pricemulti', {
    fsyms,
    tsyms: currency.toUpperCase()
  }, 60 * 1000); // Cache for 1 minute
  
  const result: Record<string, number> = {};
  
  Object.entries(data).forEach(([symbol, prices]: [string, any]) => {
    result[symbol.toLowerCase()] = prices[currency.toUpperCase()];
  });
  
  return result;
}
