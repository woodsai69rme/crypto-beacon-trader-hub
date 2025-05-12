
// Basic data types
export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  image?: string;
  changePercent?: number;
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  marketCap?: number;
  volume?: number;
  image?: string;
  changePercent?: number;
}

// Widget related types
export type WidgetType = 
  | "price-chart"
  | "portfolio-summary"
  | "watchlist"
  | "chart"
  | "trading"
  | "aiTrading"
  | "aiAnalysis"
  | "stats"
  | "news"
  | "alerts"
  | "table"
  | "custom";

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  position?: { x: number, y: number };
}

// Settings related types
export interface TickerSettings {
  enabled: boolean;
  position: 'top' | 'bottom' | 'both';
  speed: number;
  direction: 'left' | 'right';
  autoPause: boolean;
}

export interface SidebarSettings {
  enabled: boolean;
  position: 'left' | 'right';
  defaultCollapsed: boolean;
  collapsed: boolean;
  showLabels: boolean;
}

export interface SettingsFormValues {
  displayName?: string;
  email?: string;
  username?: string;
  bio?: string;
  theme?: string;
  language?: string;
  appearance?: {
    colorScheme?: string;
    compactMode?: boolean;
    animationsEnabled?: boolean;
    highContrastMode?: boolean;
  };
  notifications?: {
    email?: boolean;
    push?: boolean;
    trades?: boolean;
    pricing?: boolean;
    news?: boolean;
  };
  privacy?: {
    showOnlineStatus?: boolean;
    sharePortfolio?: boolean;
    shareTrades?: boolean;
    dataCollection?: boolean;
    marketingConsent?: boolean;
    thirdPartySharing?: boolean;
  };
  account?: {
    twoFactorEnabled?: boolean;
    loginAlerts?: boolean;
  };
  tradingPreferences?: {
    autoConfirm?: boolean;
    showAdvanced?: boolean;
    defaultAsset?: string;
  };
  ticker?: {
    enabled?: boolean;
    position?: string;
    speed?: number;
    direction?: string;
    autoPause?: boolean;
  };
  sidebar?: {
    enabled?: boolean;
    position?: string;
    collapsed?: boolean;
    autoHide?: boolean;
    showLabels?: boolean;
  };
}

// Portfolio types
export interface PortfolioHolding {
  id: string;
  coinId: string;
  name: string;
  symbol: string;
  amount: number;
  purchasePrice: number;
  currentPrice: number;
  value: number;
  profitLoss: number;
  profitLossPercentage: number;
  image?: string;
}

// Tax calculation types
export interface ATOTaxRate {
  minIncome: number;
  maxIncome: number | null;
  baseAmount: number;
  rate: number;
  threshold: number;
}

export interface ATOTaxCalculation {
  financialYear: string;
  incomeAmount: number;
  taxWithheld: number;
  grossCapitalGains: number;
  capitalLosses: number;
  eligibleForDiscount: boolean;
  CGTDiscount: number;
  netCapitalGains: number;
  taxableIncome: number;
  bracketInfo: string;
  incomeTax: number;
  medicareLevy: number;
  totalTaxLiability: number;
  taxRefundOrOwed: number;
}

export interface EnhancedPortfolioBenchmarkingProps {
  portfolio: PortfolioHolding[];
  benchmarks: {
    id: string;
    name: string;
    data: Array<{ date: string; value: number }>;
    color: string;
  }[];
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}
