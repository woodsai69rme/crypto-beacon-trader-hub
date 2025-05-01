
// Update the types with various additions and fixes
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
  value?: string; // For select components
  label?: string; // For select components
  rank?: number;   // For market correlations
}

export interface CryptoChartData {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  changePercent: number;
  image?: string;
  volume?: number;
  marketCap?: number;
  rank?: number;
}

export interface ExtendedTradingTimeframe {
  value: string;
  label: string;
  chartPeriod: string;
  interval: string;
  dataPoints: number;
  description: string;
}

export interface WidgetGridProps {
  id: string;
  title: string;
  type: string;
  size: 'small' | 'medium' | 'large' | 'wide' | 'tall' | 'full';
  position: { x: number; y: number };
  onRemove?: (id: string) => void;
  onUpdatePosition?: (id: string, position: { x: number; y: number }) => void;
  children?: React.ReactNode;
}

export interface WidgetListProps {
  widgets: {
    id: string;
    title: string;
    type: string;
    size?: 'small' | 'medium' | 'large' | 'wide' | 'tall' | 'full';
  }[];
  onRemove?: (id: string) => void;
}

export interface QuantitativeAnalysisProps {
  coinId: string;
  timeframe: string;
  availableCoins: CoinOption[];
}

export interface StrategyShare {
  id: string;
  userId: string;
  username: string;
  strategyName: string;
  description: string;
  performance: {
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
  };
  tags: string[];
  popularity: number;
  createdAt: string;
}

export interface TradingSignal {
  id: string;
  userId: string;
  username: string;
  coinId: string;
  coinSymbol: string;
  direction: 'buy' | 'sell';
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  timeframe: string;
  confidence: number;
  rationale: string;
  createdAt: string;
}

export interface LocalModel {
  id: string;
  name: string;
  description: string;
  type: 'prediction' | 'sentiment' | 'trading' | 'analysis';
  endpoint: string;
  status: 'connected' | 'disconnected' | 'error';
  active: boolean;
  metadata: {
    version: string;
    author?: string;
    accuracy?: number;
    trainedOn?: string;
    lastUpdated?: string;
  };
}

export interface ModelListProps {
  models: LocalModel[];
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
}

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'AUD';

// Also add any other missing interfaces that were reported in the errors
