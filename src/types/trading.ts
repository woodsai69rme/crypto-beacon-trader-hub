
// This is an augmentation to the existing trading.ts file
// We're adding the LocalModel type that was referenced but missing

export interface LocalModel {
  id: string;
  name: string;
  description: string;
  type: string;
  parameters: Record<string, any>;
  performance: {
    accuracy: number;
    returns: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  status: 'active' | 'inactive' | 'training';
  lastUpdated: string;
  creator: string;
  fileSize?: number;
  version?: string;
}

export interface AITradingStrategy {
  id: string;
  name: string;
  description: string;
  type: "ai-predictive" | "traditional" | "hybrid";
  riskLevel: "low" | "medium" | "high";
  timeframe: string;
  indicators: string[];
  parameters: {
    [key: string]: any;
  };
}

export interface CoinOption {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange?: number;
  changePercent?: number;
  volume?: number;
  marketCap?: number;
  image?: string;
  rank?: number;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number | null;
  ath_change_percentage: number | null;
  ath_date: string | null;
  atl: number | null;
  atl_change_percentage: number | null;
  atl_date: string | null;
  roi: any | null;
  last_updated: string;
}
