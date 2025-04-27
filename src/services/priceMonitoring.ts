
import { CoinOption } from "@/types/trading";

interface UpdateCallback {
  (updatedCoins: CoinOption[]): void;
}

// Mock price change function
const getMockPriceChange = (currentPrice: number): number => {
  // Generate a small random price change (-2% to +2%)
  const changePercent = (Math.random() * 4) - 2; // -2% to +2%
  return currentPrice * (changePercent / 100);
};

// Simple mock implementation for price monitoring
export const startPriceMonitoring = (
  coinIds: string[],
  onPriceUpdate: UpdateCallback,
  updateInterval: number = 10000 // Update every 10 seconds by default
): (() => void) => {
  let isActive = true;
  
  // Simulated prices for demo purposes
  const mockPrices: Record<string, number> = {
    'bitcoin': 61245.32,
    'ethereum': 3010.45,
    'solana': 142.87,
    'cardano': 0.45,
    'ripple': 0.57,
    'dogecoin': 0.14,
    'binancecoin': 541.87,
    'polkadot': 6.33,
    'avalanche': 25.12,
    'uniswap': 8.74,
  };
  
  const updatePrices = () => {
    if (!isActive) return;
    
    const updatedCoins: CoinOption[] = coinIds.map(id => {
      const basePrice = mockPrices[id] || 100; // Default price if not in our mock data
      const priceChange = getMockPriceChange(basePrice);
      
      // Update stored mock price
      mockPrices[id] = basePrice + priceChange;
      
      return {
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1), // Simple capitalization
        symbol: id.substring(0, 3).toUpperCase(), // Simple symbol generation
        price: mockPrices[id],
        priceChange: priceChange,
        changePercent: (priceChange / basePrice) * 100,
      };
    });
    
    onPriceUpdate(updatedCoins);
    
    if (isActive) {
      setTimeout(updatePrices, updateInterval);
    }
  };
  
  // Start the update cycle
  setTimeout(updatePrices, updateInterval);
  
  // Return function to stop monitoring
  return () => {
    isActive = false;
  };
};

// More realistic implementation would connect to WebSocket API
export const connectToRealTimePriceStream = (
  symbols: string[],
  onPriceUpdate: UpdateCallback
): (() => void) => {
  // This would be replaced with actual WebSocket connection code
  // For now, we'll use the mock implementation
  return startPriceMonitoring(symbols, onPriceUpdate, 5000);
};
