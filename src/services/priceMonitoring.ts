
import { CoinOption } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";

type PriceUpdateCallback = (updatedCoins: CoinOption[]) => void;

interface PriceMonitor {
  coinIds: string[];
  callback: PriceUpdateCallback;
  interval: number;
  timerId: number | null;
}

const activeMonitors: PriceMonitor[] = [];

// Generate mock price updates for simulating real-time prices
const generatePriceUpdate = (coin: CoinOption): CoinOption => {
  // Create random price movement (-2% to +2%)
  const changePercent = (Math.random() * 4 - 2) / 100;
  const priceChange = coin.price * changePercent;
  const newPrice = Math.max(coin.price + priceChange, 0.000001);
  
  return {
    ...coin,
    price: parseFloat(newPrice.toFixed(2)),
    priceChange,
    changePercent: changePercent * 100,
    priceAUD: coin.priceAUD ? parseFloat((newPrice * 1.5).toFixed(2)) : undefined,
    priceEUR: coin.priceEUR ? parseFloat((newPrice * 0.9).toFixed(2)) : undefined,
    priceGBP: coin.priceGBP ? parseFloat((newPrice * 0.8).toFixed(2)) : undefined,
    current_price: parseFloat(newPrice.toFixed(2)),
    market_cap: coin.marketCap || coin.market_cap
  };
};

/**
 * Start monitoring price updates for a list of coins
 * 
 * @param coinIds Array of coin IDs to monitor
 * @param callback Function to call when prices update
 * @param interval Time between updates in milliseconds
 * @returns Function to stop monitoring
 */
export const startPriceMonitoring = (
  coinIds: string[],
  callback: PriceUpdateCallback,
  interval: number = 10000 // Default to 10 seconds
): (() => void) => {
  const initialCoins = coinIds.map(id => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1), // Capitalize first letter
    symbol: id.toUpperCase().slice(0, 3), // Take first 3 letters as symbol
    price: Math.random() * 1000 + 1, // Random price between 1 and 1001
    marketCap: Math.random() * 100000000000, // Random market cap
    volume: Math.random() * 5000000000, // Random volume
    priceChange: 0,
    changePercent: 0,
    image: `https://api.dicebear.com/7.x/identicon/svg?seed=${id}`,
    current_price: Math.random() * 1000 + 1,
    market_cap: Math.random() * 100000000000,
    market_cap_rank: 1
  }));
  
  // Create the monitor
  const monitor: PriceMonitor = {
    coinIds,
    callback,
    interval,
    timerId: null
  };
  
  // Initial data push
  callback(initialCoins);
  
  // Start the interval
  const timerId = window.setInterval(() => {
    try {
      const updatedCoins = initialCoins.map(generatePriceUpdate);
      callback(updatedCoins);
    } catch (error) {
      console.error("Error updating prices:", error);
    }
  }, interval);
  
  monitor.timerId = timerId;
  activeMonitors.push(monitor);
  
  // Return stop function
  return () => {
    if (monitor.timerId !== null) {
      clearInterval(monitor.timerId);
      const index = activeMonitors.indexOf(monitor);
      if (index > -1) {
        activeMonitors.splice(index, 1);
      }
    }
  };
};

/**
 * Stop all active price monitors
 */
export const stopAllPriceMonitoring = (): void => {
  activeMonitors.forEach(monitor => {
    if (monitor.timerId !== null) {
      clearInterval(monitor.timerId);
    }
  });
  activeMonitors.length = 0;
};

/**
 * Get simulated real-time price for a single coin
 */
export const getRealtimePrice = async (coinId: string): Promise<number> => {
  // This is a simulated function. In a real app, this would fetch from an API
  return new Promise((resolve) => {
    setTimeout(() => {
      const basePrice = 100; // Base price
      const randomFactor = Math.random() * 0.1 - 0.05; // -5% to +5%
      resolve(basePrice * (1 + randomFactor));
    }, 500);
  });
};

export const startPriceMonitoringService = () => {
  toast({
    title: "Price monitoring activated",
    description: "Real-time price updates are now being simulated"
  });
};
