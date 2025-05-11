
import { CoinOption, CryptoData } from "@/types/trading";

// Mock data for cryptocurrency market information
const mockCryptoMarketData: CryptoData[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    price: 58352.12,
    priceChange: 1245.32,
    changePercent: 2.18,
    marketCap: 1143349097968,
    volume: 48941516789
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    price: 3105.78,
    priceChange: 65.43,
    changePercent: 2.15,
    marketCap: 373952067386,
    volume: 21891456789
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    price: 0.45,
    priceChange: -0.01,
    changePercent: -2.17,
    marketCap: 15893456789,
    volume: 467891234
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    price: 152.37,
    priceChange: 5.23,
    changePercent: 3.55,
    marketCap: 67891234567,
    volume: 3578912345
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "Binance Coin",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    price: 611.45,
    priceChange: -2.35,
    changePercent: -0.38,
    marketCap: 98765432198,
    volume: 2867891234
  }
];

/**
 * Fetch cryptocurrency market data
 * This is a mock function that returns sample data
 * In a production app, this would call an actual API
 */
export const fetchCoinMarketData = async (): Promise<CryptoData[]> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockCryptoMarketData.map(coin => ({
    ...coin,
    // Add small random variations to simulate real-time data changes
    price: coin.price * (1 + (Math.random() * 0.01 - 0.005)),
    priceChange: coin.priceChange * (1 + (Math.random() * 0.02 - 0.01)),
    changePercent: coin.changePercent * (1 + (Math.random() * 0.02 - 0.01)),
  }));
};

/**
 * Fetch historical price data for a specific coin
 * @param coinId Cryptocurrency identifier
 * @param days Number of days of historical data
 */
export const fetchCoinHistoricalData = async (coinId: string, days = 7): Promise<{
  timestamps: number[];
  prices: number[];
}> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  const timestamps: number[] = [];
  const prices: number[] = [];
  
  // Generate mock historical data based on coin's current price
  const coin = mockCryptoMarketData.find(c => c.id === coinId);
  const basePrice = coin ? coin.price : 100; // Default to 100 if coin not found
  let lastPrice = basePrice;
  
  // Generate data points for each day
  for (let i = days; i >= 0; i--) {
    timestamps.push(now - (i * dayInMs));
    
    // Create somewhat realistic price movements (with some randomness but a trend)
    const changePercent = (Math.random() * 6) - 3; // Between -3% and 3%
    const priceChange = lastPrice * (changePercent / 100);
    lastPrice += priceChange;
    
    prices.push(Math.max(1, lastPrice)); // Ensure price doesn't go below 1
  }
  
  return { timestamps, prices };
};

/**
 * Fetches coin options for dropdowns and selects
 */
export const fetchCoinOptions = async (): Promise<CoinOption[]> => {
  const coins = await fetchCoinMarketData();
  
  return coins.map(coin => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    price: coin.price,
    priceChange: coin.priceChange,
    changePercent: coin.changePercent,
    image: coin.image,
    marketCap: coin.marketCap,
    volume: coin.volume,
    value: coin.id,
    label: `${coin.name} (${coin.symbol})`
  }));
};
