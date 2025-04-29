export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price?: number;
  priceChange?: number;
  changePercent?: number;
  image?: string;
  volume?: number;
  marketCap?: number;
  rank?: number;
  value: string;  // Added for select components
  label: string;  // Added for select components
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
}

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  params?: Record<string, string>;
  requiresAuth: boolean;
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
}

export type WidgetType = 'portfolio-summary' | 'price-chart' | 'watchlist' | 'news' | 'alerts' | 'trading' | 'aiTrading' | 'multiExchange' | 'education' | 'community' | 'aiAnalysis' | 'custom';

export interface PortfolioBenchmark {
  id: string;
  name: string;
  symbol: string;
  type: 'crypto' | 'index' | 'stock';
  data: {
    date: string;
    value: number;
    performance: number;
  }[];
  color: string;
  performance: number;
  lastUpdated: string;
}

export interface ATOTaxRate {
  minIncome: number;
  maxIncome: number;
  baseAmount: number;
  marginRate: number;
}

export interface ATOTaxCalculation {
  taxYear: string;
  year: number;
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
}
