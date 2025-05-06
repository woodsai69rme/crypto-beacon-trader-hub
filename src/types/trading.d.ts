
export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  changePercent: number; // Added this missing property
  image: string;
  volume: number;
  marketCap: number;
  value: string;
  label: string;
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
  total: number; // Added for compatibility
  timestamp: string;
  currency: string;
  botGenerated?: boolean;
  strategyId?: string;
}

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  initialBalance: number;
  currency: string;
  trades: Trade[];
  createdAt: string;
  lastModified?: string;
}

export interface TaxHarvestTrade {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  totalValue: number;
  currentValue: number;
  timestamp: string;
  profitLoss: number;
}

export interface TradingFormProps {
  onSubmit: (trade: Omit<Trade, 'id' | 'timestamp'>) => void;
  availableBalance: number;
  selectedCoin: CoinOption;
}

export interface RealTimePriceChartProps {
  coinId: string;
  timeframe?: string;
  height?: number | string;
  showControls?: boolean;
}

export interface QuantitativeAnalysisProps {
  coinId: string;
  timeframe?: string;
}

export interface ExtendedTradingTimeframe {
  id: string;
  label: string;
  value: string;
  duration: number;
  candleCount: number;
  description: string;
}

export interface TradingSignal {
  id: string;
  type: 'buy' | 'sell' | 'hold';
  coinId: string;
  coinName: string;
  coinSymbol: string;
  price: number;
  confidence: number;
  description: string;
  timestamp: string;
  source: string;
  parameters?: Record<string, any>;
}

export interface StrategyShare {
  id: string;
  name: string;
  description: string;
  userId: string;
  userName: string;
  performance: {
    roi: number;
    winRate: number;
    sharpeRatio: number;
  };
  popularity: number;
  timestamp: string;
  tags: string[];
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

export interface ModelListProps {
  models: LocalModel[];
  onSelect?: (model: LocalModel) => void;
  onConnect?: (model: LocalModel) => void;
  onDisconnect?: (modelId: string) => void;
}
