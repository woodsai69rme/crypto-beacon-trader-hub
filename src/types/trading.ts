
// Basic cryptocurrency data type
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number | null;
  ath_change_percentage: number | null;
  ath_date: string | null;
  atl: number | null;
  atl_change_percentage: number | null;
  atl_date: string | null;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
}

// Coin option for dropdown and selection interfaces
export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange?: number;
  changePercent?: number;
  image?: string;
  volume?: number;
  marketCap?: number;
  rank?: number;
}

// Chart data structure from API responses
export interface CryptoChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

// Transaction data for portfolio
export interface Transaction {
  id: string;
  coinId: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  date: string;
  fee?: number;
  notes?: string;
}

// Portfolio data for tracking holdings
export interface PortfolioData {
  id: string;
  userId: string;
  name: string;
  coins: PortfolioCoin[];
  totalValue: number;
  lastUpdated: string;
}

// Individual coin holding in a portfolio
export interface PortfolioCoin {
  coinId: string;
  amount: number;
  averageBuyPrice: number;
  currentPrice?: number;
  currentValue?: number;
  profitLoss?: number;
  profitLossPercentage?: number;
}

// Price alert configuration
export interface PriceAlert {
  id: string;
  userId: string;
  coinId: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  createdAt: string;
  triggered?: boolean;
  triggeredAt?: string;
}

// AI Trading strategy definition
export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'traditional' | 'ai-predictive' | 'hybrid';
  riskLevel: 'low' | 'medium' | 'high';
  timeframe: '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w';
  indicators: string[];
  parameters: Record<string, any>;
}

// Local model for AI trading
export interface LocalModel {
  id: string;
  name: string;
  description?: string;
  status: 'running' | 'stopped' | 'error';
  strategy: string;
  coins: string[];
  startedAt?: string;
  lastUpdate?: string;
  performance?: {
    totalPnL: number;
    winRate: number;
    trades: number;
  };
  config?: Record<string, any>;
}

// API Provider interface
export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  authMethod: 'header' | 'query' | 'none';
  apiKeyName?: string;
  apiKey?: string;
  requiresAuth: boolean;
  enabled: boolean;
  priority: number;
  endpoints: Record<string, string>;
  defaultHeaders?: Record<string, string>;
}

// API Endpoint
export interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: string;
  description?: string;
}

// Portfolio benchmark for performance comparison
export interface PortfolioBenchmark {
  id: string;
  name: string;
  symbol: string;
  type: 'crypto' | 'stock' | 'index' | 'custom';
  performance: number[];
  data?: number[];  // Historical data points
  color?: string;   // Color for chart display
  lastUpdated: string;
}

// ATO Tax Rate structure
export interface ATOTaxRate {
  minIncome: number;
  maxIncome: number | null;
  baseAmount: number;
  marginRate: number;
  year: string;
}

// ATO Tax Calculation result
export interface ATOTaxCalculation {
  financialYear: string;
  assessableIncome: number;
  capitalGains: number;
  shortTermGains: number;
  longTermGains: number;
  CGTDiscount: number;
  deductions: number;
  taxableIncome: number;
  taxPayable: number;
  medicareLevyPayable: number;
  taxWithheld: number;
  taxRefundOrOwed: number;
  currency: string;
}
