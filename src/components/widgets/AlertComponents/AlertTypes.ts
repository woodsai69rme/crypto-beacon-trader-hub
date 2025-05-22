
import { AlertFrequency, AlertFormData, CoinOption, AlertData } from "@/types/trading";

export type { AlertFormData, CoinOption, AlertData };
export type { AlertFrequency };

export const COIN_OPTIONS: Record<string, CoinOption> = {
  bitcoin: { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  ethereum: { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  solana: { id: "solana", name: "Solana", symbol: "SOL" },
  cardano: { id: "cardano", name: "Cardano", symbol: "ADA" },
  ripple: { id: "ripple", name: "XRP", symbol: "XRP" }
};
