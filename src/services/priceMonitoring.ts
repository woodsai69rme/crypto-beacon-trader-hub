
import { CoinOption } from '@/types/trading';

/**
 * Starts monitoring cryptocurrency prices with regular updates
 * @param coinIds Array of coin IDs to monitor
 * @param updateCallback Callback function to handle updated prices
 * @param interval Update interval in milliseconds
 * @returns Function to stop price monitoring
 */
export const startPriceMonitoring = (
  coinIds: string[],
  updateCallback: (updatedCoins: CoinOption[]) => void,
  interval: number = 5000
): () => void => {
  console.log(`Starting price monitoring for ${coinIds.length} coins`);
  
  // In a real application, this would connect to a websocket or API
  // For demo purposes, we'll simulate price updates with random fluctuations
  
  // Set up interval to update prices periodically
  const intervalId = setInterval(() => {
    const updatedCoins: CoinOption[] = coinIds.map(coinId => {
      // Generate a random price change between -1% and +1%
      const priceChangePct = (Math.random() * 2 - 1) / 100;
      
      // Return a simplified coin object with updated price
      // In a real app, you would fetch the current price from an API
      return {
        id: coinId,
        name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
        symbol: coinId.substring(0, 3).toUpperCase(),
        price: getBasePriceForCoin(coinId) * (1 + priceChangePct),
        priceChange: getBasePriceForCoin(coinId) * priceChangePct,
        changePercent: priceChangePct * 100
      };
    });
    
    // Call the update callback with the updated coins
    updateCallback(updatedCoins);
  }, interval);
  
  // Return a function to stop the price monitoring
  return () => {
    clearInterval(intervalId);
    console.log('Price monitoring stopped');
  };
};

/**
 * Helper function to get a base price for a coin based on its ID
 * In a real application, this would be fetched from an API
 */
const getBasePriceForCoin = (coinId: string): number => {
  const basePrices: Record<string, number> = {
    bitcoin: 60000,
    ethereum: 3000,
    ripple: 0.6,
    cardano: 0.45,
    solana: 120,
    dogecoin: 0.14,
    polkadot: 6.5,
    chainlink: 12,
    litecoin: 70,
    stellar: 0.12
  };
  
  return basePrices[coinId.toLowerCase()] || 
    // Default for unknown coins: random price between $0.1 and $100
    Math.floor(Math.random() * 10000) / 100;
};
