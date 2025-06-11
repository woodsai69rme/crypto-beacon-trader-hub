
import { AlertFrequency, NotificationMethod } from "@/types/trading";

export interface PriceAlertFormData {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  targetPrice: number;
  isAbove: boolean;
  recurring: boolean;
  percentageChange: number;
  enabled: boolean;
  notifyVia: NotificationMethod[];
}

export interface VolumeAlertFormData {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  volumeThreshold: number;
  frequency: AlertFrequency;
  enabled: boolean;
  notifyVia: NotificationMethod[];
}

export interface TechnicalAlertFormData {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  indicator: string;
  condition: string;
  value: number;
  timeframe: string;
  enabled: boolean;
  notifyVia: NotificationMethod[];
}

export interface AlertFormData {
  id?: string;
  type: 'price' | 'volume' | 'technical';
  coinId: string;
  coinName: string;
  coinSymbol: string;
  targetPrice?: number;
  isAbove?: boolean;
  recurring?: boolean;
  percentageChange?: number;
  volumeThreshold?: number;
  frequency?: AlertFrequency;
  indicator?: string;
  condition?: string;
  value?: number;
  timeframe?: string;
  enabled: boolean;
  notifyVia: NotificationMethod[];
}

export type CoinOption = {
  id: string;
  name: string;
  symbol: string;
};

export const COIN_OPTIONS: Record<string, CoinOption> = {
  bitcoin: { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  ethereum: { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  solana: { id: "solana", name: "Solana", symbol: "SOL" },
  cardano: { id: "cardano", name: "Cardano", symbol: "ADA" },
  ripple: { id: "ripple", name: "XRP", symbol: "XRP" }
};
