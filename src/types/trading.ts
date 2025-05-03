
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
  value: string;
  label: string;
}

export type ValueType = number | string;

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: "trend-following" | "mean-reversion" | "breakout" | "sentiment" | "machine-learning" | "multi-timeframe" | "traditional" | "ai-predictive" | "hybrid";
  timeframe: string;
  parameters: any;
  creator?: string;
  tags?: string[];
  riskLevel: "low" | "medium" | "high";
}

export interface AiBotTradingProps {
  botId: string;
  strategy: AITradingStrategy;
  assetPair: string;
  isActive: boolean;
}

export interface RealTimePriceChartProps {
  coinId: string;
  selectedCoinId?: string;
  onSelectCoin?: (coinId: string) => void;
  availableCoins: CoinOption[];
  updateInterval?: number;
}

// Define interfaces for API-related components
export interface ApiUsageMetricsProps {
  apiUsage: Array<{
    service: string;
    currentUsage: number;
    maxUsage: number;
    resetTime: string;
    endpoint: string;
  }>;
  onRefresh: () => void;
}

export interface RealTimeApiUsageProps {
  selectedService: string;
  onServiceSelect: (service: any) => void;
}

// Define interface for crypto data
export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  volume_24h: number;
  circulating_supply: number;
  market_cap_change_24h?: number;
}

// Define ATOTaxCalculation interface
export interface ATOTaxCalculation {
  totalIncome: number;
  taxableIncome: number;
  taxOwed: number;
  medicareLevyOwed: number;
  totalTaxOwed: number;
  taxRefundOrOwed: number;
  taxRate: number;
  effectiveTaxRate: number;
}

// Define ApiEndpoint and ApiProvider interfaces
export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  description: string;
  responseTime: number;
  lastUsed: string;
  requiresAuth: boolean;
}

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  description: string;
  endpoints: ApiEndpoint[];
  isActive: boolean;
  apiKey: string;
  usageLimit: number;
  currentUsage: number;
}
