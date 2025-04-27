
// Define cryptocurrency data types
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation?: number | null;
  total_volume?: number;
  high_24h?: number | null;
  low_24h?: number | null;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  market_cap_change_24h?: number;
  market_cap_change_percentage_24h?: number;
  circulating_supply?: number;
  total_supply?: number | null;
  max_supply?: number | null;
  ath?: number | null;
  ath_change_percentage?: number | null;
  ath_date?: string | null;
  atl?: number | null;
  atl_change_percentage?: number | null;
  atl_date?: string | null;
  roi?: any | null;
  last_updated?: string;
}

// Type for chart data
export interface CryptoChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// Type for supported currencies
export type SupportedCurrency = "USD" | "EUR" | "GBP" | "AUD";

// Type for coin options in dropdowns and selections
export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceAUD?: number;
  priceEUR?: number;
  priceGBP?: number;
  // Additional fields needed across the application
  image?: string;
  priceChange?: number;
  changePercent?: number;
  volume?: number;
  marketCap?: number;
  rank?: number;
}

// Type for watchlist items
export interface WatchlistItem extends CryptoData {
  // Additional watchlist-specific fields can be added here
  addedAt?: string;
  notes?: string;
}

// Type for API key information
export interface ApiKeyInfo {
  service: string;
  key: string;
  isActive: boolean;
  lastTested?: string;
  testResult?: 'success' | 'failed';
}

// Type for API usage statistics
export interface ApiUsageStats {
  service: string;
  currentUsage: number;
  maxUsage: number;
  resetTime?: string;
  endpoint?: string;
}

// Type for real-time price updates
export interface PriceUpdate {
  coinId: string;
  price: number;
  timestamp: number;
}

// Type for API rate limits
export interface ApiRateLimit {
  name: string;
  current: number;
  max: number;
  unit: string;
  interval: string;
  warning?: boolean;
}

// Type for API exchange rate limit groups
export interface ExchangeRateLimit {
  exchange: string;
  limits: ApiRateLimit[];
}
