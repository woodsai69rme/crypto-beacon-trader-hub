
import { CoinOption } from '@/types/trading';

// Mock initial coin data
const mockCoins: Record<string, CoinOption> = {
  'bitcoin': { 
    id: 'bitcoin', 
    name: 'Bitcoin', 
    symbol: 'BTC', 
    price: 61245.32,
    priceChange: 1200,
    changePercent: 2.3,
    volume: 28000000000,
    marketCap: 1180000000000
  },
  'ethereum': { 
    id: 'ethereum', 
    name: 'Ethereum', 
    symbol: 'ETH', 
    price: 3010.45,
    priceChange: -120,
    changePercent: -1.5,
    volume: 15000000000,
    marketCap: 360000000000
  },
  'solana': { 
    id: 'solana', 
    name: 'Solana', 
    symbol: 'SOL', 
    price: 121.33,
    priceChange: 3.56,
    changePercent: 3.1,
    volume: 5200000000,
    marketCap: 90000000000
  },
  'cardano': { 
    id: 'cardano', 
    name: 'Cardano', 
    symbol: 'ADA', 
    price: 0.45,
    priceChange: -0.02,
    changePercent: -2.6,
    volume: 890000000,
    marketCap: 24000000000
  },
  'ripple': { 
    id: 'ripple', 
    name: 'XRP', 
    symbol: 'XRP', 
    price: 0.61,
    priceChange: 0.01,
    changePercent: 1.8,
    volume: 2400000000,
    marketCap: 32000000000
  },
  'dogecoin': { 
    id: 'dogecoin', 
    name: 'Dogecoin', 
    symbol: 'DOGE', 
    price: 0.138,
    priceChange: -0.004,
    changePercent: -2.1,
    volume: 1900000000,
    marketCap: 18000000000
  }
};

/**
 * Generate a random price change with weighted probability to create realistic movements
 * Most changes will be small, some will be medium, few will be large
 */
const generatePriceChange = (basePrice: number): number => {
  const rand = Math.random();
  let changePercentage: number;
  
  if (rand < 0.8) {
    // 80% chance of small change (0.1% - 0.5%)
    changePercentage = (Math.random() * 0.4 + 0.1) / 100;
  } else if (rand < 0.95) {
    // 15% chance of medium change (0.5% - 1.5%)
    changePercentage = (Math.random() * 1.0 + 0.5) / 100;
  } else {
    // 5% chance of larger change (1.5% - 3%)
    changePercentage = (Math.random() * 1.5 + 1.5) / 100;
  }
  
  // 50% chance of negative change
  if (Math.random() < 0.5) {
    changePercentage = -changePercentage;
  }
  
  return basePrice * changePercentage;
};

/**
 * Start monitoring prices for given coin IDs
 * @param coinIds Array of coin IDs to monitor
 * @param onUpdate Callback function when prices are updated
 * @param interval Interval in milliseconds between updates
 * @returns Function to stop monitoring
 */
export const startPriceMonitoring = (
  coinIds: string[],
  onUpdate: (updatedCoins: CoinOption[]) => void,
  interval: number = 10000
): (() => void) => {
  // Initialize coins from mockCoins or with defaults if not found
  const monitoredCoins: Record<string, CoinOption> = {};
  coinIds.forEach(id => {
    monitoredCoins[id] = mockCoins[id] || {
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      symbol: id.substring(0, 3).toUpperCase(),
      price: 100 + Math.random() * 900,
      priceChange: 0,
      changePercent: 0,
      volume: Math.random() * 1000000000,
      marketCap: Math.random() * 10000000000
    };
  });

  // Function to update prices
  const updatePrices = () => {
    const updatedCoins: CoinOption[] = [];
    
    Object.entries(monitoredCoins).forEach(([id, coin]) => {
      const priceChange = generatePriceChange(coin.price);
      const newPrice = coin.price + priceChange;
      const newChangePercent = ((newPrice - coin.price) / coin.price) * 100;
      
      // Update volume with small random change
      const volumeChange = coin.volume * (Math.random() * 0.1 - 0.05);
      const newVolume = Math.max(0, coin.volume + volumeChange);
      
      // Update market cap based on new price
      const newMarketCap = (newPrice / coin.price) * coin.marketCap;
      
      const updatedCoin: CoinOption = {
        ...coin,
        price: newPrice,
        priceChange,
        changePercent: newChangePercent,
        volume: newVolume,
        marketCap: newMarketCap
      };
      
      monitoredCoins[id] = updatedCoin;
      updatedCoins.push(updatedCoin);
    });
    
    onUpdate(updatedCoins);
  };

  // Start the interval
  const intervalId = window.setInterval(updatePrices, interval);
  
  // Return function to stop monitoring
  return () => {
    window.clearInterval(intervalId);
  };
};

/**
 * Get coin data for a specific coin ID
 * @param coinId Coin ID
 * @returns CoinOption or undefined if not found
 */
export const getCoinData = (coinId: string): CoinOption | undefined => {
  return mockCoins[coinId];
};

/**
 * Get all available coins
 * @returns Array of CoinOption
 */
export const getAllCoins = (): CoinOption[] => {
  return Object.values(mockCoins);
};
