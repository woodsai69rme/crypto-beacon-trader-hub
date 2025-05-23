
// Common types for trading features
export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  changePercent?: number;
  marketCap?: number;
  volume?: number;
  image?: string;
  value: string; // For select component
  label: string; // For select component
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange?: number;
  changePercent?: number;
  marketCap?: number;
  volume?: number;
  image?: string;
}

// Interface for trading analysis types
export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

export interface RealTimePricesProps {
  initialCoins: CoinOption[];
  onSelectCoin?: (coinId: string) => void;
  selectedCoinId?: string;
  refreshInterval?: number;
}

export interface ApiProvider {
  id: string;
  name: string;
  enabled: boolean;
  apiKey?: string;
  rate_limit: number;
  endpoints: string[];
  priority: number;
  baseUrl: string;
}

export interface ApiUsageStats {
  service: string;
  currentUsage: number;
  maxUsage: number;
  endpoint: string;
  resetTime: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  source: string;
  url: string;
  timestamp: string;
  sentiment?: number;
  topics?: string[];
  image?: string;
}

export interface TaxBracket {
  bracket: number;
  rate: number;
  description: string;
}

export interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  value: number;
  price: number;
  changePercent?: number;
  allocation?: number;
}

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: 'exchange' | 'paper';
  assets: PortfolioAsset[];
  createdAt: string;
  isActive: boolean;
}
