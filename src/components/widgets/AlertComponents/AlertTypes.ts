
import { AlertFrequency } from "@/types/alerts";

export interface PriceAlertFormData {
  type: 'price';
  coinId: string;
  coinName: string;
  coinSymbol: string;
  targetPrice: number;
  isAbove: boolean;
  recurring: boolean;
  percentageChange: number;
  enabled: boolean;
  frequency: AlertFrequency;
  notifyVia: ("email" | "app" | "push")[];
}

export interface VolumeAlertFormData {
  type: 'volume';
  coinId: string;
  coinName: string;
  coinSymbol: string;
  volumeThreshold: number;
  frequency: AlertFrequency;
  enabled: boolean;
  notifyVia: ("email" | "app" | "push")[];
}

export interface TechnicalAlertFormData {
  type: 'technical';
  coinId: string;
  coinName: string;
  coinSymbol: string;
  indicator: string;
  condition: string;
  value: number;
  frequency: AlertFrequency;
  enabled: boolean;
  notifyVia: ("email" | "app" | "push")[];
}

export type AlertFormData = PriceAlertFormData | VolumeAlertFormData | TechnicalAlertFormData;

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
