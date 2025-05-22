
// Support AUD as default currency
export type SupportedCurrency = 'AUD' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'CHF';

// News and ticker types
export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  url: string;
}

export interface NewsTickerProps {
  items?: NewsItem[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

// Coin data types
export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  price: number;
  priceChange: number;
  changePercent?: number;
  volume?: number;
  marketCap?: number;
  value?: string;
  label?: string;
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  image?: string;
  marketCap?: number;
  volume?: number;
  changePercent?: number;
}

// Dashboard and widget types
export interface DetachableDashboardProps {
  initialCoinId?: string;
  refreshInterval?: number;
  onClose: () => void;
  darkMode?: boolean;
  isDetached?: boolean;
  children?: React.ReactNode;
}

export type WidgetType = 
  | 'portfolio-summary' 
  | 'price-chart' 
  | 'watchlist' 
  | 'news' 
  | 'alerts'
  | 'trading'
  | 'aiTrading'
  | 'aiAnalysis'
  | 'custom';

export type WidgetSize = 'small' | 'medium' | 'large';

export interface Widget {
  id: string;
  position: { x: number, y: number };
  title: string;
  type: WidgetType;
  size: WidgetSize;
  customContent?: string;
}

// API and Analytics types
export interface ApiUsageStats {
  service: string;
  currentUsage: number;
  maxUsage: number;
  endpoint: string;
  resetTime: string;
}

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  requiresAuth: boolean;
  apiKey?: string;
  isActive: boolean;
  endpoints: ApiEndpoint[];
}

export interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: string;
  requiresAuth: boolean;
}

export interface LiveAnalyticsDashboardProps {
  initialCoinId?: string;
  refreshInterval?: number;
  showDetailedView?: boolean;
  onAlertTriggered?: (alert: any) => void;
  darkMode?: boolean;
}

// Trading and Portfolio types
export interface TradingAccount {
  id: string;
  name: string;
  type?: 'paper' | 'exchange' | 'wallet';
  provider?: string;
  balance: number;
  currency: SupportedCurrency;
  createdAt: string;
  updatedAt?: string;
  isActive?: boolean;
  assets?: PortfolioAsset[];
  lastUpdated?: string;
}

export interface PortfolioAsset {
  coinId: string;
  coinSymbol: string;
  coinName: string;
  amount: number;
  averagePrice: number;
  value?: number;
  symbol?: string; // Add for backward compatibility
  name?: string; // Add for backward compatibility
  price?: number; // Add for backward compatibility
  allocation?: number;
  change24h?: number;
  changePercent24h?: number;
}

// Trading form props
export interface TradingFormProps {
  selectedCoin?: CoinOption;
  onTrade?: (trade: Trade) => void;
  initialValues?: Partial<{
    type: 'buy' | 'sell';
    amount: number;
    price: number;
  }>;
}

// Fake trading form props
export interface FakeTradingFormProps {
  selectedCoin?: CoinOption;
  onTrade?: (trade: Trade) => void;
}

// AI Trading types
export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: string;
  timeframe: string; // Changed from enum to string to support "1h", "4h", etc.
  parameters: {
    riskLevel: string;
    strategyType?: string;
    backtestResults?: {
      winRate: number;
      profitFactor: number;
      sharpeRatio: number;
      drawdown: number;
      returns: number;
    }
  };
  tags?: string[];
  creator?: string;
  riskLevel?: string; // Added for backward compatibility
  indicators?: string[]; // Added for backward compatibility
}

export interface Trade {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  type: 'buy' | 'sell' | 'hold';
  amount: number;
  price: number;
  totalValue: number;
  timestamp: string;
  currency: string;
  botGenerated?: boolean;
  strategyId?: string;
  fees?: number;
  coin?: string;
  total: number;
}

// Local Model types
export interface LocalModel {
  id: string;
  name: string;
  type: 'cloud' | 'local' | 'api';
  endpoint: string;
  apiKey?: string;
  isConnected: boolean;
  lastUsed?: string;
  description?: string;
}

export interface ModelListProps {
  models: LocalModel[];
  onConnect: (model: LocalModel) => void;
  onDisconnect: (modelId: string) => void;
  onDelete: (modelId: string) => void;
  onSelect?: (model: LocalModel) => void;
}

// Enhanced Portfolio Benchmarking Props
export interface EnhancedPortfolioBenchmarkingProps {
  portfolioData?: any;
  benchmarks?: string[];
  timeframe?: string;
  portfolioPerformance?: number[];
  portfolioDates?: string[];
}

// Context types
export interface CurrencyContextType {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  formatCurrency: (amount: number) => string;
  activeCurrency: SupportedCurrency;
  setActiveCurrency: (currency: SupportedCurrency) => void;
}

// Settings types
export interface SettingsFormValues {
  theme: string;
  currency: SupportedCurrency;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    app: boolean;
    trades?: boolean;
  };
  tickerSettings: {
    enabled: boolean;
    position: 'top' | 'bottom' | 'both';
    speed: number;
    direction: 'left' | 'right';
  };
  sidebarSettings: {
    enabled: boolean;
    position: 'left' | 'right';
    defaultCollapsed: boolean;
  };
  ticker?: {
    enabled: boolean;
    position: string;
    speed: number;
    direction: string;
    autoPause: boolean;
  };
  sidebar?: {
    enabled: boolean;
    position: string;
    collapsed: boolean;
    showLabels: boolean;
  };
}

export interface ModelPerformanceProps {
  model: LocalModel;
  performance: {
    accuracy: number;
    returns: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}
