
import type { CoinOption } from "@/types/trading";

type UpdateCallback = (updatedPrices: CoinOption[]) => void;

// Cache to store the latest prices
let latestPrices: Record<string, CoinOption> = {};

// Default price variations in percentage (for simulating real-time changes)
const DEFAULT_PRICE_VARIATIONS: Record<string, number> = {
  bitcoin: 0.5,  // 0.5% variation
  ethereum: 0.7, // 0.7% variation
  solana: 1.2,   // 1.2% variation
  cardano: 1.0,  // 1.0% variation
  ripple: 0.8,   // 0.8% variation
  dogecoin: 1.5, // 1.5% variation
};

/**
 * Function to simulate price updates for specified coins
 * @param coinIds List of coin IDs to monitor
 * @param callback Function to call with updated prices
 * @param interval How often to update prices in milliseconds
 * @returns Function to stop monitoring
 */
export function startPriceMonitoring(
  coinIds: string[],
  callback: UpdateCallback,
  interval: number = 10000
): () => void {
  // Initialize our prices if empty
  if (Object.keys(latestPrices).length === 0) {
    initializeDefaultPrices();
  }

  // Function to update prices with random variations
  const updatePrices = () => {
    const updatedCoins: CoinOption[] = [];

    coinIds.forEach(coinId => {
      if (latestPrices[coinId]) {
        const coin = { ...latestPrices[coinId] };
        const variation = DEFAULT_PRICE_VARIATIONS[coinId] || 0.5;
        
        // Random price change between -variation% and +variation%
        const changePercent = (Math.random() * variation * 2) - variation;
        const newPrice = coin.price * (1 + changePercent / 100);
        
        // Update the coin price
        coin.price = parseFloat(newPrice.toFixed(2));
        
        // Update cached price
        latestPrices[coinId] = coin;
        updatedCoins.push(coin);
      }
    });

    // Call the callback with updated prices
    if (updatedCoins.length > 0) {
      callback(updatedCoins);
    }
  };

  // Start interval for price updates
  const intervalId = window.setInterval(updatePrices, interval);
  
  // Return function to stop monitoring
  return () => {
    window.clearInterval(intervalId);
  };
}

// Initialize default prices for common cryptocurrencies
function initializeDefaultPrices() {
  const defaultCoins: CoinOption[] = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 61245.32 },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3010.45 },
    { id: "solana", name: "Solana", symbol: "SOL", price: 142.87 },
    { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.45 },
    { id: "ripple", name: "XRP", symbol: "XRP", price: 0.57 },
    { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.14 },
  ];

  defaultCoins.forEach(coin => {
    latestPrices[coin.id] = coin;
  });
}

/**
 * Get the current price for a specific coin
 * @param coinId ID of the coin
 * @returns The coin data or undefined if not found
 */
export function getCoinPrice(coinId: string): CoinOption | undefined {
  return latestPrices[coinId];
}

/**
 * Get all currently cached coin prices
 * @returns Array of all cached coin prices
 */
export function getAllCoinPrices(): CoinOption[] {
  return Object.values(latestPrices);
}
