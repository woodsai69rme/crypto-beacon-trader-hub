// Common interfaces
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
  value?: string;
  label?: string;
  priceAUD?: number;
  priceEUR?: number;
  priceGBP?: number;
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price?: number;
  image?: string;
  marketCap?: number;
  volume?: number;
  changePercent?: number;
}

// Trading interfaces
export interface Trade {
  id: string;
  coinId: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number;
  total: number;
  fee?: number;
}

export interface TradeResult {
  success: boolean;
  trade: Trade;
  message?: string;
}

export interface TradingAccount {
  id: string;
  name: string;
  exchange: string;
  apiKey?: string;
  apiSecret?: string;
  balance?: number;
  currency?: string;
  connected?: boolean;
  isActive?: boolean;
  provider?: string;
  trades?: Trade[];
}

export interface AccountWithBotsEnabled {
  id?: string;
  name?: string;
  exchange?: string;
  balance?: number;
  currency?: string;
  connected?: boolean;
  isActive?: boolean;
  provider?: string;
}

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  indicators: string[];
  parameters: Record<string, any>;
  performance?: {
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
  };
}

export interface AITradingStrategy extends TradingStrategy {
  aiModel: string;
  confidenceThreshold: number;
  riskLevel: 'low' | 'medium' | 'high';
  maxDrawdown: number;
  type?: string;
}

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  description?: string;
  enabled: boolean;
  requiresAuth: boolean;
  authRequired?: boolean;
  apiKey?: string;
  apiKeyName?: string;
  authMethod?: 'header' | 'query';
  endpoints: Record<string, string>;
  defaultHeaders?: Record<string, string>;
  priority?: number;
}

export interface SupportedCurrency {
  code: string;
  name: string;
  symbol: string;
}

// Props interfaces
export interface RealTimePriceChartProps {
  coinId: string;
  selectedCoinId?: string;
  onSelectCoin?: (coinId: string) => void;
  availableCoins: CoinOption[];
  updateInterval?: number;
}

export interface RealTimePricesProps {
  initialCoins: CoinOption[];
  onSelectCoin?: (coinId: string) => void;
  selectedCoinId?: string;
  refreshInterval?: number;
}

export interface TradingFormProps {
  balance: number;
  availableCoins: CoinOption[];
  onTrade: (coinId: string, type: 'buy' | 'sell', amount: number, price: number) => void;
  getOwnedCoinAmount: (coinId: string) => number;
  activeCurrency: string;
  onCurrencyChange?: (currency: string) => void;
  conversionRate: number;
}

export interface AiBotTradingProps {
  accounts?: TradingAccount[];
  strategies?: AITradingStrategy[];
}

export interface QuantitativeAnalysisProps {
  symbol: string;
  timeframe: string;
  depth?: number;
  onResultsCalculated?: (results: any) => void;
}

export interface ATOTaxCalculation {
  financialYear: string;
  totalProfit: number;
  totalLoss: number;
  netGain: number;
  taxRate: number;
  estimatedTax: number;
  trades: {
    id: string;
    asset: string;
    acquiredDate: Date;
    disposedDate: Date;
    costBase: number;
    proceedsOfDisposal: number;
    gainOrLoss: number;
    isLongTerm: boolean;
  }[];
}
