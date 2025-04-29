
import { CryptoData, CryptoChartData } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";

const BASE_URL = "https://api.coingecko.com/api/v3";

// Helper function for API requests
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout: number = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(id);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// Fetch top coins from CoinGecko
export const fetchCoinsFromCoinGecko = async (limit: number = 20): Promise<CryptoData[]> => {
  try {
    const params = new URLSearchParams({
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: limit.toString(),
      page: "1",
      sparkline: "false",
      price_change_percentage: "24h"
    });
    
    const url = `${BASE_URL}/coins/markets?${params}`;
    const data = await fetchWithTimeout(url);
    
    return data;
  } catch (error) {
    console.error("CoinGecko API Error:", error);
    throw new Error(`Failed to fetch coins from CoinGecko: ${(error as Error).message}`);
  }
};

// Fetch historical data for a specific coin
export const fetchCoinHistoryFromCoinGecko = async (coinId: string, days: number = 7): Promise<CryptoChartData> => {
  try {
    const params = new URLSearchParams({
      vs_currency: "usd",
      days: days.toString()
    });
    
    const url = `${BASE_URL}/coins/${coinId}/market_chart?${params}`;
    const data = await fetchWithTimeout(url);
    
    return data;
  } catch (error) {
    console.error("CoinGecko API Error:", error);
    throw new Error(`Failed to fetch history for ${coinId}: ${(error as Error).message}`);
  }
};

// Search for coins by query
export const searchCoinsFromCoinGecko = async (query: string): Promise<CryptoData[]> => {
  try {
    const params = new URLSearchParams({
      query
    });
    
    const url = `${BASE_URL}/search?${params}`;
    const data = await fetchWithTimeout(url);
    
    if (!data.coins || !Array.isArray(data.coins)) {
      return [];
    }
    
    // Convert search results to CryptoData format with limited info
    // We'll need to fetch full details separately if needed
    return data.coins.slice(0, 10).map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toLowerCase(),
      name: coin.name,
      image: coin.large || coin.thumb,
      current_price: 0, // We don't have price data from search endpoint
      market_cap: 0,
      market_cap_rank: coin.market_cap_rank || 0,
      fully_diluted_valuation: null,
      total_volume: 0,
      high_24h: null,
      low_24h: null,
      price_change_24h: 0,
      price_change_percentage_24h: 0,
      market_cap_change_24h: 0,
      market_cap_change_percentage_24h: 0,
      circulating_supply: 0,
      total_supply: null,
      max_supply: null,
      ath: null,
      ath_change_percentage: null,
      ath_date: null,
      atl: null,
      atl_change_percentage: null,
      atl_date: null,
      roi: null,
      last_updated: new Date().toISOString()
    }));
  } catch (error) {
    console.error("CoinGecko API Error:", error);
    throw new Error(`Failed to search coins: ${(error as Error).message}`);
  }
};
