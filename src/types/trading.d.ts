
import { ReactNode } from 'react';

// Widget related types
export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  position?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  content?: ReactNode;
  data?: any;
  config?: any;
}

export type WidgetType = 
  | 'chart' 
  | 'portfolio' 
  | 'watchlist' 
  | 'news' 
  | 'alerts' 
  | 'trades' 
  | 'market-overview'
  | 'correlation'
  | 'custom';

export type WidgetSize = 'small' | 'medium' | 'large' | 'custom';

// Crypto data related types
export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  priceChangePercentage24h: number;
  marketCap: number;
  totalVolume: number;
  high24h: number;
  low24h: number;
  image?: string;
}

export interface CoinOption {
  id: string;
  name: string;
  symbol: string;
  price?: number;
  changePercent?: number;
  marketCap?: number;
  volume?: number;
}

// Transaction/Trade related types
export interface Trade {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  fee?: number;
}

export type TransactionStatusVariant = 'pending' | 'completed' | 'failed' | 'cancelled';

// API related types
export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  description: string;
  documentation?: string;
  endpoints: ApiEndpoint[];
  requiresKey: boolean;
}

export interface ApiEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  requiresAuth: boolean;
  rateLimit?: number;
}

export interface ApiUsageStats {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  latency: number;
  lastUpdated: string;
}

// Dashboard and analytics props
export interface LiveAnalyticsDashboardProps {
  selectedCoin: CoinOption;
  apiUsage: ApiUsageStats;
}

export interface DetachableDashboardProps {
  position?: 'left' | 'right' | 'float';
  defaultOpen?: boolean;
}

// Wallet and provider types
export interface WalletProvider {
  id: string;
  name: string;
  logo: string;
  supportedChains: string[];
  description: string;
}

export interface WalletAccount {
  address: string;
  balance: number;
  provider: string;
  network: string;
}
