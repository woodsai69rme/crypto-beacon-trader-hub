
import { SupportedCurrency } from "./TradingStats";

export type Trade = {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  totalValue: number;
  timestamp: string;
  currency: SupportedCurrency;
  currentValue?: number;
  profitLoss?: number;
};

export interface LocalModel {
  id: string;
  name: string;
  endpoint: string;
  type: "prediction" | "sentiment" | "trading" | "analysis";
  isConnected: boolean;
  lastUsed?: string;
}

export type CoinOption = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceAUD?: number;
  priceEUR?: number; 
  priceGBP?: number;
};
