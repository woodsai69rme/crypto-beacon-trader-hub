
import { CoinOption } from "@/types/trading";

// Mock data for price updates
const mockPriceChanges: Record<string, number[]> = {
  'bitcoin': [61245.32, 61300.45, 61289.18, 61350.22, 61400.78, 61380.15, 61420.50, 61450.30],
  'ethereum': [3010.45, 3015.22, 3008.75, 3020.18, 3025.40, 3018.65, 3030.20, 3035.55],
  'solana': [142.87, 143.25, 142.50, 143.75, 144.30, 143.80, 144.50, 145.20],
  'cardano': [0.45, 0.452, 0.449, 0.454, 0.458, 0.455, 0.46, 0.462],
  'ripple': [0.57, 0.572, 0.568, 0.575, 0.578, 0.573, 0.58, 0.582],
  'dogecoin': [0.14, 0.141, 0.139, 0.142, 0.143, 0.141, 0.144, 0.145],
};

/**
 * Simulates real-time price monitoring with randomly generated price updates
 * @param coinIds Array of coin IDs to monitor
 * @param onPriceUpdate Callback function to handle price updates
 * @param updateInterval Interval in milliseconds between updates
 * @returns A function to stop the monitoring
 */
export function startPriceMonitoring(
  coinIds: string[],
  onPriceUpdate: (updatedCoins: CoinOption[]) => void,
  updateInterval: number = 5000
): () => void {
  let intervalId: number;
  const updateCounts: Record<string, number> = {};
  
  // Initialize update counts
  coinIds.forEach(coinId => {
    updateCounts[coinId] = 0;
  });
  
  // Simulate price updates
  const updatePrices = () => {
    const updatedCoins = coinIds.map(coinId => {
      const count = updateCounts[coinId]++;
      
      // Get base price from mock data or generate random if not available
      const basePrice = mockPriceChanges[coinId] 
        ? mockPriceChanges[coinId][count % mockPriceChanges[coinId].length]
        : 100 + Math.random() * 1000;
      
      // Generate a random change (-1% to +1%)
      const changePercent = (Math.random() * 2 - 1) * 1;
      const newPrice = basePrice * (1 + changePercent / 100);
      
      // Create updated coin object
      const updatedCoin: CoinOption = {
        id: coinId,
        name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
        symbol: coinId.substring(0, 3).toUpperCase(),
        price: newPrice,
        priceChange: newPrice - basePrice,
        changePercent: changePercent,
        volume: Math.random() * 5000000 + 1000000,
        marketCap: newPrice * (Math.random() * 100000 + 10000),
        image: `https://assets.coingecko.com/coins/images/1/large/${coinId}.png`,
      };
      
      return updatedCoin;
    });
    
    // Call the callback with updated prices
    onPriceUpdate(updatedCoins);
  };
  
  // Initial update
  updatePrices();
  
  // Set up interval for subsequent updates
  intervalId = window.setInterval(updatePrices, updateInterval);
  
  // Return a function to stop monitoring
  return () => {
    window.clearInterval(intervalId);
  };
}
