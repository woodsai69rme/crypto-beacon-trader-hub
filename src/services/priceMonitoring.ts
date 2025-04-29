
import { CoinOption } from "@/types/trading";

// Initial mock data
const mockCoins: CoinOption[] = [
  { 
    id: "bitcoin", 
    name: "Bitcoin", 
    symbol: "BTC", 
    price: 61245.32,
    priceChange: 1200,
    changePercent: 2.3,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    volume: 28000000000,
    marketCap: 1180000000000,
    value: "bitcoin",
    label: "Bitcoin (BTC)"
  },
  { 
    id: "ethereum", 
    name: "Ethereum", 
    symbol: "ETH", 
    price: 3010.45,
    priceChange: -120,
    changePercent: -1.5,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    volume: 15000000000,
    marketCap: 360000000000,
    value: "ethereum",
    label: "Ethereum (ETH)"
  },
  { 
    id: "solana", 
    name: "Solana", 
    symbol: "SOL", 
    price: 121.33,
    priceChange: 3.56,
    changePercent: 3.1,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    volume: 5200000000,
    marketCap: 90000000000,
    value: "solana",
    label: "Solana (SOL)"
  },
  { 
    id: "cardano", 
    name: "Cardano", 
    symbol: "ADA", 
    price: 0.45,
    priceChange: -0.02,
    changePercent: -2.6,
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    volume: 890000000,
    marketCap: 24000000000,
    value: "cardano",
    label: "Cardano (ADA)"
  },
  { 
    id: "ripple", 
    name: "XRP", 
    symbol: "XRP", 
    price: 0.61,
    priceChange: 0.01,
    changePercent: 1.8,
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    volume: 2400000000,
    marketCap: 32000000000,
    value: "ripple",
    label: "XRP (XRP)"
  },
  { 
    id: "dogecoin", 
    name: "Dogecoin", 
    symbol: "DOGE", 
    price: 0.138,
    priceChange: -0.004,
    changePercent: -2.1,
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    volume: 1900000000,
    marketCap: 18000000000,
    value: "dogecoin",
    label: "Dogecoin (DOGE)"
  }
];

// Simulates price fluctuations for realistic data
const simulateMarketMovement = (coins: CoinOption[]): CoinOption[] => {
  return coins.map(coin => {
    // Random price movement between -2% and 2%
    const changePercent = (Math.random() * 4) - 2;
    const priceChange = coin.price * (changePercent / 100);
    const newPrice = coin.price + priceChange;
    
    return {
      ...coin,
      price: Number(newPrice.toFixed(2)),
      priceChange: Number(priceChange.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      // Update other currency conversions
      priceAUD: Number((newPrice * 1.5).toFixed(2)),
      priceEUR: Number((newPrice * 0.92).toFixed(2)),
      priceGBP: Number((newPrice * 0.79).toFixed(2))
    };
  });
};

// Start monitoring price changes
export const startPriceMonitoring = (
  coinIds: string[],
  onUpdate: (coins: CoinOption[]) => void,
  intervalMs: number = 5000
) => {
  // Filter coins based on requested IDs
  let monitoredCoins = mockCoins.filter(coin => coinIds.includes(coin.id));
  
  // If no coins match, use defaults
  if (monitoredCoins.length === 0) {
    monitoredCoins = mockCoins;
  }
  
  // Initial update
  onUpdate(monitoredCoins);
  
  // Set up interval for price movements
  const intervalId = setInterval(() => {
    monitoredCoins = simulateMarketMovement(monitoredCoins);
    onUpdate(monitoredCoins);
  }, intervalMs);
  
  // Return function to stop monitoring
  return () => clearInterval(intervalId);
};
