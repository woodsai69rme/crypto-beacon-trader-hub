
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
  change24h?: number;
  changePercent24h?: number;
  coinName?: string; // Added to fix type errors
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
  trades?: Trade[]; // Added to fix type errors
}

// Added for EnhancedPortfolioBenchmarkingProps
export interface EnhancedPortfolioBenchmarkingProps {
  portfolioData: any;
  benchmarks: string[];
  timeframe: string;
  portfolioPerformance: number[];
  portfolioDates: string[];
}

// For settings components
export interface SettingsComponentProps {
  form: any;
}

// For settings form values with privacy and account sections
export interface SettingsFormValues {
  theme: string;
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    app: boolean;
    trades?: boolean;
    pricing?: boolean;
    news?: boolean;
  };
  tickerSettings: TickerSettings;
  sidebarSettings: SidebarSettings;
  privacy?: {
    showOnlineStatus: boolean;
    sharePortfolio: boolean;
    shareTrades: boolean;
  };
  account?: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
  };
  tradingPreferences?: {
    autoConfirm: boolean;
    showAdvanced: boolean;
    defaultAsset: string;
  };
}

// Ticker settings
export interface TickerSettings {
  enabled: boolean;
  position: 'top' | 'bottom' | 'both';
  speed: number;
  direction: 'left' | 'right';
  autoPause: boolean;
}

// Sidebar settings
export interface SidebarSettings {
  enabled: boolean;
  position: 'left' | 'right';
  defaultCollapsed: boolean;
  showLabels: boolean;
  collapsed?: boolean;
}

// Added for compatibility with missing types
export interface Trade {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  totalValue: number;
  timestamp: string;
  currency: string;
  currentValue?: number;
  profitLoss?: number;
  botGenerated?: boolean;
  strategyId?: string;
  fees?: number;
  coin?: string;
  total: number;
  tags?: string[];
}
