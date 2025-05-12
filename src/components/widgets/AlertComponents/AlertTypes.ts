
import { PriceAlertFormData } from "@/types/trading";

// Mock coin options for alerts
export const COIN_OPTIONS: Record<string, { id: string; name: string; symbol: string; price: number }> = {
  "bitcoin": { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 51234.78 },
  "ethereum": { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 2487.32 },
  "solana": { id: "solana", name: "Solana", symbol: "SOL", price: 143.89 },
  "cardano": { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.43 },
  "ripple": { id: "ripple", name: "XRP", symbol: "XRP", price: 0.53 }
};

// Default price alert form data
export const defaultAlertFormData: PriceAlertFormData = {
  coinId: "bitcoin",
  coinName: "Bitcoin",
  coinSymbol: "BTC",
  targetPrice: 55000,
  currentPrice: 51234.78,
  isAbove: true,
  notifyVia: ["app"]
};

export interface AlertSystemProps {
  onCreateAlert?: (alert: PriceAlertFormData) => void;
  onDeleteAlert?: (alertId: string) => void;
  onToggleAlert?: (alertId: string, active: boolean) => void;
}
