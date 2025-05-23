import { CoinOption, CryptoData } from "@/types/trading";

// Mock data for top cryptocurrencies
const mockTopCryptoData: CoinOption[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 58352.12,
    priceChange: 1245.32,
    changePercent: 2.18,
    marketCap: 1143349097968,
    volume: 48941516789,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    value: "bitcoin",
    label: "Bitcoin (BTC)"
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 3105.78,
    priceChange: 65.43,
    changePercent: 2.15,
    marketCap: 373952067386,
    volume: 21891456789,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    value: "ethereum",
    label: "Ethereum (ETH)"
  },
  {
    id: "binancecoin",
    name: "Binance Coin",
    symbol: "BNB",
    price: 604.12,
    priceChange: 12.45,
    changePercent: 2.10,
    marketCap: 93518794521,
    volume: 1862354123,
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    value: "binancecoin",
    label: "Binance Coin (BNB)"
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 143.87,
    priceChange: 7.23,
    changePercent: 5.29,
    marketCap: 63287612543,
    volume: 3691845721,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    value: "solana",
    label: "Solana (SOL)"
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    price: 0.45,
    priceChange: 0.02,
    changePercent: 4.65,
    marketCap: 16789456123,
    volume: 756123489,
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    value: "cardano",
    label: "Cardano (ADA)"
  }
];

export const fetchTopCryptoData = async (limit: number = 10): Promise<CoinOption[]> => {
  // In a real app, this would fetch from an API like CoinGecko or CoinMarketCap
  console.info(`Fetching top ${limit} cryptocurrencies`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For demo purposes, return mock data
  return mockTopCryptoData.slice(0, limit).map(coin => ({
    ...coin,
    // Add some randomness to price and change values to simulate real-time updates
    price: coin.price * (1 + (Math.random() * 0.02 - 0.01)),
    priceChange: coin.priceChange * (1 + (Math.random() * 0.1 - 0.05)),
    changePercent: coin.changePercent! * (1 + (Math.random() * 0.1 - 0.05))
  }));
};

export const fetchCryptoData = async (coinId: string): Promise<CryptoData | null> => {
  console.info(`Fetching data for coin: ${coinId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Find coin in mock data
  const coin = mockTopCryptoData.find(c => c.id === coinId);
  
  if (!coin) return null;
  
  // Add some randomness to price and change values
  return {
    ...coin,
    price: coin.price * (1 + (Math.random() * 0.02 - 0.01)),
    priceChange: coin.priceChange * (1 + (Math.random() * 0.1 - 0.05)),
    changePercent: coin.changePercent! * (1 + (Math.random() * 0.1 - 0.05))
  };
};

export const fetchMultipleCryptoData = async (coinIds: string[]): Promise<CoinOption[]> => {
  console.info(`Fetching data for multiple coins: ${coinIds.join(', ')}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Filter and map coins from mock data
  return mockTopCryptoData
    .filter(coin => coinIds.includes(coin.id))
    .map(coin => ({
      ...coin,
      price: coin.price * (1 + (Math.random() * 0.02 - 0.01)),
      priceChange: coin.priceChange * (1 + (Math.random() * 0.1 - 0.05)),
      changePercent: coin.changePercent! * (1 + (Math.random() * 0.1 - 0.05))
    }));
};

export const fetchTrendingCoins = async (): Promise<CoinOption[]> => {
  console.info("Fetching trending coins");
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // For demo, just return a shuffled subset of the mock data
  return [...mockTopCryptoData]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5)
    .map(coin => ({
      ...coin,
      price: coin.price * (1 + (Math.random() * 0.05 - 0.025)),
      priceChange: coin.priceChange * (1 + (Math.random() * 0.2 - 0.1)),
      changePercent: coin.changePercent! * (1 + (Math.random() * 0.2 - 0.1))
    }));
};

export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  console.info(`Searching for coins with query: ${query}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Filter mock data based on search query
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  return mockTopCryptoData.filter(
    coin => coin.name.toLowerCase().includes(lowerQuery) || 
            coin.symbol.toLowerCase().includes(lowerQuery) ||
            coin.id.toLowerCase().includes(lowerQuery)
  );
};

// Historical data generation for charts
export const fetchHistoricalPriceData = async (
  coinId: string, 
  days: number = 30,
  interval: string = 'daily'
): Promise<{ date: string; price: number; volume: number }[]> => {
  console.info(`Fetching historical price data for ${coinId} over ${days} days`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const data = [];
  const now = new Date();
  const coin = mockTopCryptoData.find(c => c.id === coinId);
  
  if (!coin) return [];
  
  let basePrice = coin.price * 0.8; // Start at 80% of current price
  const volatility = 0.03; // Daily price volatility
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    // Generate a price movement with a slight uptrend
    const change = (Math.random() - 0.45) * volatility;
    basePrice = basePrice * (1 + change);
    
    // Generate a volume with some correlation to price change
    const volumeMultiplier = 1 + (Math.abs(change) * 10);
    const volume = (coin.volume || 1000000000) * (0.7 + (Math.random() * 0.6)) * volumeMultiplier;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: basePrice,
      volume: volume
    });
  }
  
  return data;
};

export default {
  fetchTopCryptoData,
  fetchCryptoData,
  fetchMultipleCryptoData, // Add the new function to the default export
  fetchMultipleCoinsData,
  fetchTrendingCoins,
  searchCoins,
  fetchHistoricalPriceData,
};
