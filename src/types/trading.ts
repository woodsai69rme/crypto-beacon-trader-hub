
export type SupportedCurrency = 'AUD' | 'USD' | 'EUR' | 'GBP';
export type ColorScheme = 'default' | 'neon-future' | 'sunset-gradient' | 'matrix-code' | 'cyber-pulse';

export interface Trade {
  id: string;
  coinId?: string;
  coinName?: string;
  coinSymbol?: string;
  symbol: string; // Primary symbol field
  type: 'buy' | 'sell';
  amount?: number;
  quantity: number; // Primary quantity field
  price: number;
  totalValue: number;
  total?: number;
  timestamp: string;
  currency?: string;
  botGenerated?: boolean;
  strategyId?: string;
  botId?: string;
  tags?: string[];
}

export interface TradingAccount {
  id: string;
  name: string;
  trades: Trade[];
  balance: number;
  currency: SupportedCurrency;
  createdAt: string;
  type: 'paper' | 'live';
  assets: any[];
}
