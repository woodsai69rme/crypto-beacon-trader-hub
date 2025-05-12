
export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: string;
  timeframe: string;
  riskLevel?: string;
  parameters: {
    period?: number;
    threshold?: number;
    stopLoss?: number;
    takeProfit?: number;
    useVolume?: boolean;
    indicator?: string;
    allowWeekendTrading?: boolean;
    fastPeriod?: number;
    slowPeriod?: number;
    signalPeriod?: number;
    upperBand?: number;
    lowerBand?: number;
    riskFactor?: number;
    sentimentThreshold?: number;
    sentimentTimeframe?: string;
    [key: string]: any;
  };
  assets?: string[];
}

export interface BacktestResult {
  returns: number;
  winRate: number;
  trades: number;
  maxDrawdown: number;
  sharpeRatio: number;
  profitFactor: number;
  tradeHistory?: Trade[];
}

export interface OptimizationResult {
  id: string;
  strategyId: string;
  parameters: Record<string, any>;
  performance: {
    returns: number;
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  trades: number;
  timeframe: string;
  optimizationDate: string;
  improvement?: number;
  parameterValues: Record<string, any>;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange: number;
  changePercent: number;
  marketCap?: number;
  volume?: number;
  image?: string;
}

export interface Trade {
  id: string;
  timestamp: string;
  date: string;
  type: string;
  price: number;
  amount: number;
  total: number;
  profit: number;
  profitPercentage: number;
  coin: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  currency: string;
  totalValue: number;
}

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  changePercent: number;
  value: string;
  label: string;
  marketCap?: number;
  volume?: number;
  image?: string;
}

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'AUD';

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  initialBalance: number;
  currency: SupportedCurrency;
  createdAt: string;
  positions: Position[];
  trades: Trade[];
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    allTime: number;
  };
}

export interface Position {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  amount: number;
  entryPrice: number;
  currentPrice: number;
  value: number;
  profitLoss: number;
  profitLossPercentage: number;
  openedAt: string;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  method: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  rateLimit: number;
  usageCount: number;
  lastUsed?: string;
  category: string;
  description: string;
  isActive: boolean;
  provider?: string;
}

export interface SidebarSettings {
  defaultCollapsed: boolean;
  showLabels: boolean;
  position: 'left' | 'right';
  width: number;
}

export interface LocalModel {
  id: string;
  name: string;
  type: string;
  description: string;
  version: string;
  connected: boolean;
  parameters: Record<string, any>;
  status: 'idle' | 'running' | 'error';
  performance?: Record<string, any>;
  lastUsed?: string;
}

export interface RealTimePriceChartProps {
  coinId?: string;
  selectedCoinId?: string;
  onSelectCoin?: (coinId: string) => void;
  availableCoins: CoinOption[];
  updateInterval?: number;
}

export interface TradingFormProps {
  initialCoin?: CoinOption;
  onTradeSubmit?: (trade: Trade) => void;
}
