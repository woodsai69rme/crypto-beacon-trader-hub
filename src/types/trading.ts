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
  profitLoss?: number;
  currentValue?: number;
  botGenerated?: boolean;
  strategyId?: string;
}

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceAUD?: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalProfitLoss: number;
  isProfitPositive: boolean;
  percentageChange: number;
  currency: 'USD' | 'AUD';
}

export interface CurrencyConversion {
  USD_AUD: number;
  AUD_USD: number;
  lastUpdated: string;
}

export type WidgetType = 'trading' | 'aiTrading' | 'multiExchange' | 'education' | 'community' | 'aiAnalysis' | 'custom';
export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  position: number;
  customContent?: string;
}

export interface TradingAccount {
  id: string;
  name: string;
  balance: number;
  initialBalance: number;
  trades: Trade[];
  createdAt: string;
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: 'ai' | 'traditional' | 'hybrid';
  color: string;
  indicators: string[];
  timeframes: string[];
  stats: {
    winRate: number;
    averageReturn: number;
    riskLevel: string;
    maxDrawdown: number;
  };
}
