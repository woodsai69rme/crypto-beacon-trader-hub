
// Mock price monitoring service using fake data
import { CoinOption } from '@/types/trading';
import { v4 as uuidv4 } from 'uuid';

// Initial coin prices
const coinPrices: Record<string, number> = {
  bitcoin: 30000,
  ethereum: 1800,
  solana: 45,
  cardano: 0.45,
  dogecoin: 0.08,
  polkadot: 5.2
};

// Cached coin data
const coinData: Record<string, CoinOption> = {
  bitcoin: {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: coinPrices.bitcoin,
    priceChange: 0,
    changePercent: 0,
    value: "bitcoin",
    label: "Bitcoin (BTC)",
    marketCap: 580000000000,
    volume: 25000000000,
    image: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png"
  },
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: coinPrices.ethereum,
    priceChange: 0,
    changePercent: 0,
    value: "ethereum",
    label: "Ethereum (ETH)",
    marketCap: 220000000000,
    volume: 12000000000,
    image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png"
  },
  solana: {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: coinPrices.solana,
    priceChange: 0,
    changePercent: 0,
    value: "solana",
    label: "Solana (SOL)",
    marketCap: 18000000000,
    volume: 1500000000,
    image: "https://assets.coingecko.com/coins/images/4128/small/solana.png"
  },
  cardano: {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    price: coinPrices.cardano,
    priceChange: 0,
    changePercent: 0,
    value: "cardano",
    label: "Cardano (ADA)",
    marketCap: 14000000000,
    volume: 500000000,
    image: "https://assets.coingecko.com/coins/images/975/small/cardano.png"
  },
  dogecoin: {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    price: coinPrices.dogecoin,
    priceChange: 0,
    changePercent: 0,
    value: "dogecoin",
    label: "Dogecoin (DOGE)",
    marketCap: 10500000000,
    volume: 800000000,
    image: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png"
  },
  polkadot: {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    price: coinPrices.polkadot,
    priceChange: 0,
    changePercent: 0,
    value: "polkadot",
    label: "Polkadot (DOT)",
    marketCap: 6000000000,
    volume: 300000000,
    image: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png"
  }
};

// Generate some popular coin options
const popularCoins: CoinOption[] = [
  coinData.bitcoin,
  coinData.ethereum,
  coinData.solana,
  coinData.cardano,
  coinData.dogecoin,
  coinData.polkadot
];

// Update coin price and calculate change
const updateCoinPrice = (coinId: string): CoinOption => {
  const coin = coinData[coinId];
  if (!coin) return createDefaultCoin(coinId);
  
  const change = (Math.random() * 6) - 3; // -3% to +3% change
  const oldPrice = coin.price;
  const newPrice = oldPrice * (1 + change / 100);
  
  const updatedCoin: CoinOption = {
    ...coin,
    price: newPrice,
    priceChange: newPrice - oldPrice,
    changePercent: change
  };
  
  // Update the stored data
  coinPrices[coinId] = newPrice;
  coinData[coinId] = updatedCoin;
  
  return updatedCoin;
};

// Create a default coin if one doesn't exist
const createDefaultCoin = (coinId: string): CoinOption => {
  const symbol = coinId.substring(0, 3).toUpperCase();
  const name = coinId.charAt(0).toUpperCase() + coinId.slice(1);
  
  return {
    id: coinId,
    name: name,
    symbol: symbol,
    price: 100,
    priceChange: 0,
    changePercent: 0,
    value: coinId,
    label: `${name} (${symbol})`,
  };
};

// Start monitoring prices for a list of coins
export const startPriceMonitoring = (
  coinIds: string[],
  onPriceUpdate: (updatedCoins: CoinOption[]) => void,
  updateInterval: number = 10000
): (() => void) => {
  // Ensure the coins exist in our cache
  coinIds.forEach(id => {
    if (!coinData[id]) {
      coinData[id] = createDefaultCoin(id);
    }
  });

  // Set up the interval to update prices
  const intervalId = setInterval(() => {
    const updatedCoins = coinIds.map(id => updateCoinPrice(id));
    onPriceUpdate(updatedCoins);
  }, updateInterval);
  
  // Return a cleanup function
  return () => clearInterval(intervalId);
};

// Get the current price for a coin
export const getCurrentPrice = (coinId: string): number => {
  return coinPrices[coinId] || 0;
};

// Add a new coin to monitoring
export const addCoinToMonitoring = (
  coinId: string,
  initialPrice: number
): void => {
  coinPrices[coinId] = initialPrice;
  if (!coinData[coinId]) {
    coinData[coinId] = createDefaultCoin(coinId);
    coinData[coinId].price = initialPrice;
  }
};

// Reset prices to initial values
export const resetPrices = (): void => {
  Object.keys(coinPrices).forEach(coinId => {
    const initialPrice = coinId === 'bitcoin' ? 30000 :
                        coinId === 'ethereum' ? 1800 :
                        coinId === 'solana' ? 45 :
                        coinId === 'cardano' ? 0.45 :
                        coinId === 'dogecoin' ? 0.08 :
                        coinId === 'polkadot' ? 5.2 : 100;
    
    coinPrices[coinId] = initialPrice;
    
    if (coinData[coinId]) {
      coinData[coinId].price = initialPrice;
      coinData[coinId].priceChange = 0;
      coinData[coinId].changePercent = 0;
    }
  });
};

// Connect to real-time price stream (in a real app, this would use WebSockets)
export const connectToRealTimePriceStream = (
  symbols: string[],
  onPriceUpdate: (updatedCoins: CoinOption[]) => void
): (() => void) => {
  // In a real implementation, this would establish a WebSocket connection
  // For this mock, we'll just use the interval-based monitoring
  return startPriceMonitoring(
    symbols.map(s => s.toLowerCase()),
    onPriceUpdate,
    5000 // Faster updates for "real-time" effect
  );
};

// Get a list of popular coins
export const getPopularCoins = (): CoinOption[] => {
  return popularCoins;
};

// Search for coins by name or symbol
export const searchCoins = (
  query: string
): Promise<CoinOption[]> => {
  // In a real implementation, this would call an API
  // For this mock, we'll filter the cached coins
  return new Promise(resolve => {
    setTimeout(() => {
      const normalizedQuery = query.toLowerCase();
      const results = popularCoins.filter(coin => 
        coin.name.toLowerCase().includes(normalizedQuery) || 
        coin.symbol.toLowerCase().includes(normalizedQuery)
      );
      resolve(results);
    }, 300);
  });
};

export default {
  startPriceMonitoring,
  getCurrentPrice,
  addCoinToMonitoring,
  resetPrices,
  connectToRealTimePriceStream,
  getPopularCoins,
  searchCoins
};
