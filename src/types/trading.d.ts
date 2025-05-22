
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
  id?: string;
  coinId: string;
  coinSymbol: string;
  coinName: string;
  amount: number;
  averagePrice: number;
  value?: number;
}

// AI Trading types
export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'trend-following' | 'mean-reversion' | 'custom';
  timeframe: string; // "1h" | "4h" | "1d" etc.
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
}

// Context types
export interface CurrencyContextType {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  formatCurrency: (amount: number) => string;
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
}
