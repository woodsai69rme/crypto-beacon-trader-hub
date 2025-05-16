
import { TradingPosition } from "./trading";

export interface WidgetComponentProps {
  id: string;
  type: string;
  title: string;
  onRemove: (id: string) => void;
  [key: string]: any;
}

// PricePoint definition for real-time price chart
export interface PricePoint {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: string;
  timeframe: string;
  riskLevel: string;
  indicators: string[];
}

export interface BacktestResults {
  initialBalance: number;
  finalBalance: number;
  profit: number;
  trades: number;
  winRate: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export interface OpenRouterRequest {
  model: string;
  messages: { role: string; content: string }[];
  temperature?: number;
  max_tokens?: number;
}

// Widget-related types
export type WidgetType = 
  | 'price-chart' 
  | 'portfolio-summary' 
  | 'watchlist' 
  | 'trading' 
  | 'aiTrading' 
  | 'aiAnalysis';

export interface TradingData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
}

export interface Order {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: number;
  status: 'open' | 'filled' | 'cancelled';
}

export interface TradingStrategy {
  name: string;
  description: string;
  parameters: any;
  // Add more properties as needed
}

export interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  // Add more properties as needed
}

export interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
  // Add more properties as needed
}

// Add the TradingPosition type since it's imported in other files
export enum TradingPosition {
  LONG = 'long',
  SHORT = 'short',
  NEUTRAL = 'neutral',
}
