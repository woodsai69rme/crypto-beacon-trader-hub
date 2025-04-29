
export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;  // Required property
  priceChange?: number;
  changePercent?: number;
  image?: string;
  volume?: number;
  marketCap?: number;
  rank?: number;
  value?: string;  // For select components
  label?: string;  // For select components
  priceAUD?: number;
  priceEUR?: number;
  priceGBP?: number;
}

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  description: string;
  website: string;
  docs: string;
  authRequired: boolean;
  apiKey?: string;
  enabled: boolean;
  requiresAuth?: boolean;
  apiKeyName?: string;
  authMethod?: string;
  priority?: number;
  defaultHeaders?: Record<string, string>;
  endpoints?: ApiEndpoint[];
  rateLimit?: number;
  tier?: string;
}

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  params?: Record<string, string>;
  requiresAuth: boolean;
  id?: string;
  authentication?: boolean;
  rateLimit?: string;
  parameters?: Record<string, string>;
  cacheDuration?: number;
  headers?: any[];
  body?: any[];
  rateLimited?: boolean;
}

export interface ApiKeyInfo {
  id: string;
  provider: string;
  key: string;
  name: string;
  createdAt: string;
  lastUsed: string;
  isActive: boolean;
  isValid: boolean;
  service: string;
  permissions: string[];
}

export interface AddWidgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWidget: (widget: { title: string; type: WidgetType; size: WidgetSize; customContent?: string }) => void;
}

export interface Widget {
  id: string;
  position: {
    x: number;
    y: number;
  };
  title: string;
  type: WidgetType;
  size: WidgetSize;
  lastUpdated?: string;
  customContent?: string;
  config?: any;
}

export type WidgetType = 'portfolio-summary' | 'price-chart' | 'watchlist' | 'news' | 'alerts' | 'trading' | 'aiTrading' | 'multiExchange' | 'education' | 'community' | 'aiAnalysis' | 'custom' | 'chart' | 'portfolio' | 'trade-history' | 'market-overview' | 'performance-metrics';

export type WidgetSize = 'small' | 'medium' | 'large' | 'wide' | 'tall' | 'full';

export interface PortfolioBenchmark {
  id: string;
  name: string;
  symbol: string;
  type: 'crypto' | 'index' | 'stock' | 'custom';
  data: {
    date: string;
    value: number;
    performance: number;
  }[];
  color: string;
  performance: number[];
  lastUpdated: string;
}

export interface ATOTaxRate {
  year: number;
  minIncome: number;
  maxIncome: number | null;
  baseAmount: number;
  marginRate: number;
}

export interface ATOTaxCalculation {
  year: number;
  taxYear: string;
  assessableIncome: number;
  taxableIncome: number;
  bracketInfo: ATOTaxRate;
  taxPayable: number;
  taxWithheld: number;
  taxRefundOrOwed: number;
  capitalGains: number;
  CGTDiscount: number;
  deductions: number;
  effectiveTaxRate: number;
  effectiveRate: number;
  marginalRate: number;
  takeHome: number;
  medicareLevyPayable: number;
  income: number;
  breakdown: {
    bracket: string;
    amount: number;
    tax: number;
  }[];
  financialYear?: string;
}

export interface WidgetGridProps {
  widgets: Widget[];
  onRemove?: (id: string) => void;
  onUpdatePosition?: (id: string, position: { x: number; y: number }) => void;
}

export interface WidgetListProps {
  widgets: Widget[];
  onRemove?: (id: string) => void;
}

export type SupportedCurrency = "USD" | "AUD" | "EUR" | "GBP" | "JPY" | "CAD" | "CHF" | "CNY" | "SGD" | "NZD";

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  currency?: SupportedCurrency;
  provider?: string;
  type?: string;
  allowBots?: boolean;
}

export interface ModelRunningTabProps {
  selectedModel: LocalModel | null;
  isRunning: boolean;
  onStopModel: () => void;
  onStartModel: (model: LocalModel) => void;
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: string;
  returnRate: number;
  winRate: number;
  risk: 'low' | 'medium' | 'high';
  timeframe: string;
  parameters?: Record<string, any>;
  assets?: string[];
  backtestResults?: {
    periods: number;
    profit: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
}

export interface LocalModel {
  id: string;
  name: string;
  endpoint: string;
  type: "prediction" | "sentiment" | "trading" | "analysis";
  isConnected: boolean;
  lastUsed?: string;
  description?: string;
  performance?: {
    accuracy: number;
    returns: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

export interface EnhancedPortfolioBenchmarkingProps {
  portfolioPerformance: number[];
  portfolioDates: string[];
}
