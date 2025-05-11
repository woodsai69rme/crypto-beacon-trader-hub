
import { CoinOption } from '@/types/trading';

type PriceUpdateCallback = (updatedCoins: CoinOption[]) => void;

// Mock function to simulate price updates from different providers
const fetchPriceUpdates = async (coinIds: string[]): Promise<CoinOption[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Generate mock price updates
  return coinIds.map(coinId => {
    // Generate small random price changes
    const priceChange = (Math.random() * 2 - 1) * 100; // Between -100 and 100
    const basePrice = coinId === 'bitcoin' ? 60000 : 
                      coinId === 'ethereum' ? 3000 :
                      coinId === 'solana' ? 120 : 
                      coinId === 'cardano' ? 0.45 :
                      coinId === 'ripple' ? 0.6 : 
                      coinId === 'dogecoin' ? 0.14 : 500;
    
    const price = basePrice + priceChange;
    const changePercent = (priceChange / basePrice) * 100;
    
    return {
      id: coinId,
      name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
      symbol: coinId.substring(0, 3).toUpperCase(),
      price,
      priceChange,
      changePercent,
      image: `https://example.com/images/${coinId}.png`,
      volume: Math.random() * 1000000000,
      marketCap: price * (Math.random() * 100000000 + 10000000),
      value: coinId,
      label: `${coinId.charAt(0).toUpperCase() + coinId.slice(1)} (${coinId.substring(0, 3).toUpperCase()})`
    };
  });
};

export const startPriceMonitoring = (
  coinIds: string[],
  onPriceUpdate: PriceUpdateCallback,
  interval: number = 10000 // Default 10 seconds
): (() => void) => {
  // Initial fetch
  fetchPriceUpdates(coinIds).then(onPriceUpdate);
  
  // Set up interval for continuous updates
  const intervalId = setInterval(async () => {
    try {
      const updatedCoins = await fetchPriceUpdates(coinIds);
      onPriceUpdate(updatedCoins);
    } catch (error) {
      console.error("Error fetching price updates:", error);
    }
  }, interval);
  
  // Return function to stop monitoring
  return () => clearInterval(intervalId);
};

export const setupPriceAlerts = (
  coinId: string,
  targetPrice: number,
  condition: 'above' | 'below',
  onTrigger: (coinId: string, price: number) => void
): (() => void) => {
  // Set up interval to check price against target
  const intervalId = setInterval(async () => {
    try {
      const [updatedCoin] = await fetchPriceUpdates([coinId]);
      const currentPrice = updatedCoin.price;
      
      if (condition === 'above' && currentPrice > targetPrice) {
        onTrigger(coinId, currentPrice);
        clearInterval(intervalId); // Alert fired, stop monitoring
      } else if (condition === 'below' && currentPrice < targetPrice) {
        onTrigger(coinId, currentPrice);
        clearInterval(intervalId); // Alert fired, stop monitoring
      }
    } catch (error) {
      console.error("Error checking price alerts:", error);
    }
  }, 5000); // Check every 5 seconds
  
  // Return function to cancel the alert
  return () => clearInterval(intervalId);
};
