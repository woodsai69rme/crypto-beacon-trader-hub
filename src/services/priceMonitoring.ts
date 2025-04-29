
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
  interval = 3000 // Default update interval: 3 seconds
): () => void {
  // Initialize the latestPrices cache if empty
  if (Object.keys(latestPrices).length === 0) {
    coinIds.forEach(coinId => {
      const defaultPrice = getDefaultPriceForCoin(coinId);
      latestPrices[coinId] = {
        id: coinId,
        name: getCoinName(coinId),
        symbol: getCoinSymbol(coinId),
        price: defaultPrice,
        value: coinId,
        label: getCoinName(coinId),
        priceChange: 0,
        changePercent: 0,
      };
    });
  }

  // Set up interval for updating prices
  const timerId = setInterval(() => {
    const updatedCoins: CoinOption[] = [];
    
    coinIds.forEach(coinId => {
      if (!latestPrices[coinId]) return;
      
      const currentPrice = latestPrices[coinId].price;
      const variation = DEFAULT_PRICE_VARIATIONS[coinId] || 0.5;
      
      // Generate a random price change within the variation percentage
      const randomChange = (Math.random() * 2 - 1) * variation / 100;
      const newPrice = currentPrice * (1 + randomChange);
      const priceChange = newPrice - currentPrice;
      const changePercent = (priceChange / currentPrice) * 100;
      
      // Update the price in the cache
      latestPrices[coinId] = {
        ...latestPrices[coinId],
        price: newPrice,
        priceChange,
        changePercent,
        priceAUD: newPrice * 1.48, // Simple conversion rate
        priceEUR: newPrice * 0.92, // Simple conversion rate
        priceGBP: newPrice * 0.8,  // Simple conversion rate
      };
      
      updatedCoins.push(latestPrices[coinId]);
    });
    
    // Call the callback with updated prices
    if (updatedCoins.length > 0) {
      callback(updatedCoins);
    }
  }, interval);
  
  // Return a function to stop the monitoring
  return () => clearInterval(timerId);
}

/**
 * Get a default price for a coin based on its ID
 */
function getDefaultPriceForCoin(coinId: string): number {
  const defaultPrices: Record<string, number> = {
    bitcoin: 61245.32,
    ethereum: 3010.45,
    solana: 142.87,
    cardano: 0.45,
    ripple: 0.57,
    dogecoin: 0.14,
    binance: 520.76,
    polkadot: 7.32,
    litecoin: 82.14,
    chainlink: 14.56,
  };
  
  return defaultPrices[coinId] || 100; // Default to 100 if not found
}

/**
 * Get the full name of a coin based on its ID
 */
function getCoinName(coinId: string): string {
  const coinNames: Record<string, string> = {
    bitcoin: 'Bitcoin',
    ethereum: 'Ethereum',
    solana: 'Solana',
    cardano: 'Cardano',
    ripple: 'XRP',
    dogecoin: 'Dogecoin',
    binance: 'Binance Coin',
    polkadot: 'Polkadot',
    litecoin: 'Litecoin',
    chainlink: 'Chainlink',
  };
  
  return coinNames[coinId] || coinId.charAt(0).toUpperCase() + coinId.slice(1);
}

/**
 * Get the symbol of a coin based on its ID
 */
function getCoinSymbol(coinId: string): string {
  const coinSymbols: Record<string, string> = {
    bitcoin: 'BTC',
    ethereum: 'ETH',
    solana: 'SOL',
    cardano: 'ADA',
    ripple: 'XRP',
    dogecoin: 'DOGE',
    binance: 'BNB',
    polkadot: 'DOT',
    litecoin: 'LTC',
    chainlink: 'LINK',
  };
  
  return coinSymbols[coinId] || coinId.toUpperCase().slice(0, 3);
}
