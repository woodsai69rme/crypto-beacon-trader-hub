
// Create or update the trading types
export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  price?: number;
  value: string;
  label?: string;
  priceChange?: number;
  changePercent?: number;
  marketCap?: number;
  volume?: number;
}

export interface FakeTradingFormProps {
  onTrade: (trade: Trade) => void;
  availableCoins: CoinOption[];
  initialCoinId?: string;
  advancedMode?: boolean;
}

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
  total: number;
  status?: string;
}

export interface TradingAccount {
  id: string;
  name: string;
  address: string;
  balance: number;
  currency: string;
  network: string;
  isActive: boolean;
  initialBalance: number;
  assets: Array<{
    coinId: string;
    name: string;
    symbol: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
  }>;
}

export interface AITradingBot {
  id: string;
  name: string;
  model: string;
  status: string;
  strategy: string;
  asset: string;
  createdAt: string;
  accuracy: number;
  trades: number;
  successRate: number;
  profitLoss: number;
  totalTrades: number;
  performance: {
    winRate: number;
    trades: number;
    profit: number;
  };
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: string;
  timeframe: string;
  riskLevel: string;
  parameters: Record<string, any>;
  indicators?: string[];
}

export interface AIStrategyParameters {
  buySignalThreshold: number;
  sellSignalThreshold: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  timeframe: string;
  maxPositions: number;
}

export interface WalletProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  supportedChains?: string[];
}

export interface RealTimePriceChartProps {
  coinId: string;
  timeRange: string;
  height?: number;
  width?: string;
  showControls?: boolean;
}

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'AUD';

export interface AIModelConfig {
  id: string;
  name: string;
  provider: string;
  endpoint: string;
  apiKey?: string;
  parameters?: Record<string, any>;
}

export interface BacktestResults {
  totalTrades: number;
  winRate: number;
  profitLoss: number;
  sharpeRatio: number;
  maxDrawdown: number;
  trades: any[];
}
