
import { AlertFrequency } from "@/types/alerts";

export const COIN_OPTIONS: Record<string, { id: string; name: string; symbol: string }> = {
  "bitcoin": { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  "ethereum": { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  "solana": { id: "solana", name: "Solana", symbol: "SOL" },
  "cardano": { id: "cardano", name: "Cardano", symbol: "ADA" },
  "ripple": { id: "ripple", name: "Ripple", symbol: "XRP" },
};

export const ALERT_FREQUENCIES = [
  { value: "once", label: "Once" },
  { value: "recurring", label: "Recurring" },
  { value: "daily", label: "Daily" },
  { value: "hourly", label: "Hourly" },
  { value: "1h", label: "Every Hour" },
  { value: "4h", label: "Every 4 Hours" },
  { value: "24h", label: "Every 24 Hours" },
];

export const NOTIFICATION_CHANNELS = [
  { id: "app", label: "In-App" },
  { id: "email", label: "Email" },
  { id: "push", label: "Push" },
];

export const TECHNICAL_INDICATORS = [
  { value: "RSI", label: "Relative Strength Index (RSI)" },
  { value: "MACD", label: "Moving Average Convergence Divergence (MACD)" },
  { value: "MA", label: "Moving Average Crossover" },
  { value: "BB", label: "Bollinger Bands" },
  { value: "VOLUME", label: "Volume Spike" },
];

export const INDICATOR_CONDITIONS = [
  { value: "above", label: "Above" },
  { value: "below", label: "Below" },
  { value: "crosses_above", label: "Crosses Above" },
  { value: "crosses_below", label: "Crosses Below" },
  { value: "divergence", label: "Shows Divergence" },
];

// Use export type for type re-exports
export type { PriceAlertFormData, VolumeAlertFormData, TechnicalAlertFormData } from "@/types/alerts";
