
import { toast } from "@/components/ui/use-toast";

export interface MarketData {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  activeCurrencies: number;
  activeExchanges: number;
  lastUpdated: string;
}

export interface MarketTrend {
  direction: "up" | "down" | "neutral";
  percentage: number;
  timeframe: "1h" | "24h" | "7d" | "30d";
}

export interface GlobalMetrics {
  data: MarketData;
  trends: MarketTrend[];
}

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
const CMC_API_URL = "https://pro-api.coinmarketcap.com/v1";
const MESSARI_API_URL = "https://data.messari.io/api/v1";

// CoinGecko free API
export const fetchMarketDataCoinGecko = async (): Promise<MarketData | null> => {
  try {
    const response = await fetch(`${COINGECKO_API_URL}/global`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch market data");
    }
    
    const data = await response.json();
    const { data: marketData } = data;
    
    return {
      totalMarketCap: marketData.total_market_cap.usd,
      totalVolume24h: marketData.total_volume.usd,
      btcDominance: marketData.market_cap_percentage.btc,
      activeCurrencies: marketData.active_cryptocurrencies,
      activeExchanges: marketData.markets,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error fetching market data:", error);
    return null;
  }
};

// Fallback to mock data if API fails
export const getMarketData = async (): Promise<MarketData> => {
  try {
    const data = await fetchMarketDataCoinGecko();
    if (data) return data;
    throw new Error("API request failed");
  } catch (error) {
    console.error("Using mock market data due to API error:", error);
    return getMockMarketData();
  }
};

// Mock data
const getMockMarketData = (): MarketData => {
  return {
    totalMarketCap: 2134567890123,
    totalVolume24h: 98765432109,
    btcDominance: 43.2,
    activeCurrencies: 12450,
    activeExchanges: 567,
    lastUpdated: new Date().toISOString()
  };
};

// Get trends data
export const getMarketTrends = async (): Promise<MarketTrend[]> => {
  // In a real app, this would call an API
  return [
    { direction: "up", percentage: 2.3, timeframe: "1h" },
    { direction: "up", percentage: 5.7, timeframe: "24h" },
    { direction: "down", percentage: 1.2, timeframe: "7d" },
    { direction: "up", percentage: 12.8, timeframe: "30d" }
  ];
};

// Combined market metrics
export const getGlobalMetrics = async (): Promise<GlobalMetrics> => {
  const [marketData, trends] = await Promise.all([
    getMarketData(),
    getMarketTrends()
  ]);
  
  return {
    data: marketData,
    trends
  };
};

// Format large numbers for display
export const formatMarketCap = (value: number): string => {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  return `$${value.toFixed(2)}`;
};

// API integration guide - for documentation purposes
export const AVAILABLE_APIS = [
  {
    name: "CoinGecko",
    free: true,
    description: "Comprehensive cryptocurrency data API with free tier",
    endpoints: [
      "/coins/markets", 
      "/global", 
      "/coins/{id}/market_chart"
    ],
    website: "https://www.coingecko.com/en/api"
  },
  {
    name: "CoinMarketCap",
    free: false,
    description: "Professional-grade market data with limited free tier",
    endpoints: [
      "/cryptocurrency/listings/latest", 
      "/cryptocurrency/quotes/latest"
    ],
    website: "https://coinmarketcap.com/api/"
  },
  {
    name: "Messari",
    free: true,
    description: "Crypto research and market intelligence with free tier",
    endpoints: [
      "/assets", 
      "/markets", 
      "/metrics"
    ],
    website: "https://messari.io/api"
  },
  {
    name: "CryptoCompare",
    free: true,
    description: "Real-time cryptocurrency data and trading info",
    endpoints: [
      "/data/pricemulti", 
      "/data/histoday"
    ],
    website: "https://min-api.cryptocompare.com/"
  }
];
