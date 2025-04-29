
import { CoinOption } from "@/types/trading";
import apiCache from "./api/cacheService";

// Cache key for price monitoring
const PRICE_MONITORING_CACHE_KEY = "price-monitoring";

/**
 * Start monitoring prices for the given coin IDs
 * @param coinIds Array of coin IDs to monitor
 * @param onUpdate Callback function called when prices are updated
 * @param interval Update interval in milliseconds
 * @returns A function to stop monitoring
 */
export const startPriceMonitoring = (
  coinIds: string[],
  onUpdate: (coins: CoinOption[]) => void,
  interval: number = 5000
) => {
  // Initial data
  let coins: CoinOption[] = coinIds.map(id => {
    // Try to get from cache first
    const cachedCoin = apiCache.get<CoinOption>(`${PRICE_MONITORING_CACHE_KEY}-${id}`);
    
    if (cachedCoin) {
      return cachedCoin;
    }
    
    // Default values if not found in cache
    return {
      id,
      value: id,
      label: id.charAt(0).toUpperCase() + id.slice(1),
      name: id.charAt(0).toUpperCase() + id.slice(1),
      symbol: id.substring(0, 3).toUpperCase(),
      price: 100 + Math.random() * 900, // Random initial price
      priceChange: 0,
      changePercent: 0,
      volume: 1000000 + Math.random() * 9000000,
      marketCap: 10000000 + Math.random() * 90000000,
      rank: Math.floor(Math.random() * 100) + 1
    };
  });
  
  // Call the update function with initial data
  onUpdate([...coins]);
  
  // Set up interval for periodic price updates
  const intervalId = setInterval(() => {
    coins = coins.map(coin => {
      // Generate random price change (up to ±5%)
      const changePct = (Math.random() * 10) - 5;
      const priceChange = (coin.price || 0) * (changePct / 100);
      const newPrice = (coin.price || 0) + priceChange;
      
      // Update the coin with new price and change values
      const updatedCoin: CoinOption = {
        ...coin,
        price: newPrice,
        priceChange: priceChange,
        changePercent: changePct,
        // Randomly update volume and market cap occasionally
        volume: (coin.volume || 0) * (1 + (Math.random() * 0.1) - 0.05),
        marketCap: (coin.marketCap || 0) * (1 + (Math.random() * 0.1) - 0.05)
      };
      
      // Cache the updated coin
      apiCache.set(`${PRICE_MONITORING_CACHE_KEY}-${coin.id}`, updatedCoin, interval * 10);
      
      return updatedCoin;
    });
    
    // Call the update function with the updated data
    onUpdate([...coins]);
  }, interval);
  
  // Return a function to stop monitoring
  return () => {
    clearInterval(intervalId);
  };
};

/**
 * Get the latest price for a specific coin
 * @param coinId Coin ID to get the price for
 * @returns The latest price or null if not found
 */
export const getLatestPrice = (coinId: string): number | null => {
  const cachedCoin = apiCache.get<CoinOption>(`${PRICE_MONITORING_CACHE_KEY}-${coinId}`);
  return cachedCoin?.price || null;
};

/**
 * Get all monitored coins
 * @returns Array of monitored coins
 */
export const getAllMonitoredCoins = (): CoinOption[] => {
  // This is a simplified implementation
  // In a real app, we would track all monitored coins in a more sophisticated way
  const cachedItems: Record<string, any> = {};
  
  // Extract all cached coins with the monitoring prefix
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(`api-cache-${PRICE_MONITORING_CACHE_KEY}-`)) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          const coin = JSON.parse(value);
          if (coin.data && coin.data.id) {
            cachedItems[coin.data.id] = coin.data;
          }
        }
      } catch (e) {
        console.error("Error parsing cache item:", e);
      }
    }
  });
  
  return Object.values(cachedItems);
};
