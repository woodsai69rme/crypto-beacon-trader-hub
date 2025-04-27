
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

// Simple mock implementation for price monitoring
export const startPriceMonitoring = (
  coinIds: string[],
  onPriceUpdate: UpdateCallback,
  updateInterval: number = 10000 // Update every 10 seconds by default
): (() => void) => {
  let isActive = true;
  
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
        marketCap: mockPrices[id] * (Math.random() * 1000000 + 1000000),
        volume: mockPrices[id] * (Math.random() * 100000 + 10000),
        image: `https://assets.coingecko.com/coins/images/1/large/${id}.png`,
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

// Get the current mock price for a specific coin
export const getCurrentPrice = (coinId: string): number => {
  return mockPrices[coinId] || 100;
};

// Add a new coin to the monitoring system
export const addCoinToMonitoring = (
  coinId: string, 
  initialPrice: number
): void => {
  mockPrices[coinId] = initialPrice;
};

// Reset all prices to their initial values (useful for testing)
export const resetPrices = (): void => {
  mockPrices['bitcoin'] = 61245.32;
  mockPrices['ethereum'] = 3010.45;
  mockPrices['solana'] = 142.87;
  mockPrices['cardano'] = 0.45;
  mockPrices['ripple'] = 0.57;
  mockPrices['dogecoin'] = 0.14;
  mockPrices['binancecoin'] = 541.87;
  mockPrices['polkadot'] = 6.33;
  mockPrices['avalanche'] = 25.12;
  mockPrices['uniswap'] = 8.74;
};
