
import { CryptoData, CryptoChartData } from "@/types/trading";

// Mock data for cryptocurrencies
export const getMockCryptoData = (): CryptoData[] => {
  return [
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
      current_price: 58000,
      market_cap: 1100000000000,
      market_cap_rank: 1,
      fully_diluted_valuation: 1200000000000,
      total_volume: 38000000000,
      high_24h: 59000,
      low_24h: 57000,
      price_change_24h: 1200,
      price_change_percentage_24h: 2.1,
      market_cap_change_24h: 20000000000,
      market_cap_change_percentage_24h: 1.8,
      circulating_supply: 18800000,
      total_supply: 21000000,
      max_supply: 21000000,
      ath: 69000,
      ath_change_percentage: -15,
      ath_date: "2021-11-10T00:00:00.000Z",
      atl: 67,
      atl_change_percentage: 85000,
      atl_date: "2013-07-06T00:00:00.000Z",
      last_updated: new Date().toISOString(),
    },
    {
      id: "ethereum",
      symbol: "eth",
      name: "Ethereum",
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
      current_price: 3500,
      market_cap: 420000000000,
      market_cap_rank: 2,
      fully_diluted_valuation: 420000000000,
      total_volume: 18000000000,
      high_24h: 3600,
      low_24h: 3400,
      price_change_24h: 100,
      price_change_percentage_24h: 2.9,
      market_cap_change_24h: 12000000000,
      market_cap_change_percentage_24h: 2.8,
      circulating_supply: 120000000,
      total_supply: null,
      max_supply: null,
      ath: 4800,
      ath_change_percentage: -27,
      ath_date: "2021-11-10T00:00:00.000Z",
      atl: 0.43,
      atl_change_percentage: 810000,
      atl_date: "2015-10-20T00:00:00.000Z",
      last_updated: new Date().toISOString(),
    }
  ];
};

// Mock function to fetch coin history data
export const fetchCoinHistory = async (
  coinId: string,
  days: number = 30
): Promise<CryptoChartData> => {
  // Create mock historical data
  const now = Date.now();
  const prices: [number, number][] = [];
  const market_caps: [number, number][] = [];
  const total_volumes: [number, number][] = [];
  
  let basePrice = coinId === "bitcoin" ? 58000 : coinId === "ethereum" ? 3500 : 1;
  let baseMarketCap = coinId === "bitcoin" ? 1100000000000 : coinId === "ethereum" ? 420000000000 : 1000000000;
  let baseVolume = coinId === "bitcoin" ? 38000000000 : coinId === "ethereum" ? 18000000000 : 500000000;
  
  // Generate data points for each day
  for (let i = days; i >= 0; i--) {
    const timestamp = now - i * 24 * 60 * 60 * 1000;
    
    // Add some randomness to simulate price movements
    const randomFactor = 0.98 + Math.random() * 0.04; // Random factor between 0.98 and 1.02
    basePrice = basePrice * randomFactor;
    baseMarketCap = baseMarketCap * randomFactor;
    baseVolume = baseVolume * (0.9 + Math.random() * 0.2); // More volatility in volume
    
    prices.push([timestamp, basePrice]);
    market_caps.push([timestamp, baseMarketCap]);
    total_volumes.push([timestamp, baseVolume]);
  }
  
  return {
    prices,
    market_caps,
    total_volumes
  };
};

// Function to fetch top coins
export const fetchTopCoins = async (limit: number = 10): Promise<CryptoData[]> => {
  // In a real app, this would call an API
  // For now, return mock data
  const mockData = getMockCryptoData();
  
  // Add more mock coins if needed
  const additionalCoins: CryptoData[] = [
    {
      id: "cardano",
      symbol: "ada",
      name: "Cardano",
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860",
      current_price: 0.45,
      market_cap: 15000000000,
      market_cap_rank: 9,
      fully_diluted_valuation: 20000000000,
      total_volume: 500000000,
      high_24h: 0.47,
      low_24h: 0.44,
      price_change_24h: 0.01,
      price_change_percentage_24h: 2.2,
      market_cap_change_24h: 300000000,
      market_cap_change_percentage_24h: 2.0,
      circulating_supply: 33500000000,
      total_supply: 45000000000,
      max_supply: 45000000000,
      ath: 3.09,
      ath_change_percentage: -85.4,
      ath_date: "2021-09-02T00:00:00.000Z",
      atl: 0.017,
      atl_change_percentage: 2500,
      atl_date: "2020-03-13T00:00:00.000Z",
      last_updated: new Date().toISOString(),
    },
    {
      id: "solana",
      symbol: "sol",
      name: "Solana",
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422",
      current_price: 110,
      market_cap: 48000000000,
      market_cap_rank: 5,
      fully_diluted_valuation: 60000000000,
      total_volume: 2000000000,
      high_24h: 115,
      low_24h: 105,
      price_change_24h: 5,
      price_change_percentage_24h: 4.7,
      market_cap_change_24h: 2000000000,
      market_cap_change_percentage_24h: 4.5,
      circulating_supply: 436000000,
      total_supply: 536000000,
      max_supply: null,
      ath: 260,
      ath_change_percentage: -57.7,
      ath_date: "2021-11-06T00:00:00.000Z",
      atl: 0.5,
      atl_change_percentage: 21900,
      atl_date: "2020-05-11T00:00:00.000Z",
      last_updated: new Date().toISOString(),
    }
  ];
  
  // Combine and return the top N coins
  return [...mockData, ...additionalCoins].slice(0, limit);
};

// Export CryptoChartData type for proper usage
export type { CryptoChartData } from '@/types/trading';

// Export the fetchCoinMarketData function that was previously only declared
export const fetchCoinMarketData = async (): Promise<CryptoData[]> => {
  // In a real app, this would call an API
  // For now, return mock data
  const data = getMockCryptoData();
  
  // Make sure to use the right property names
  return data.map((coin: any) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    price: coin.current_price,
    priceChange: coin.price_change_24h || 0,
    changePercent: coin.price_change_percentage_24h,
    image: coin.image,
    volume: coin.total_volume,
    marketCap: coin.market_cap,
    rank: coin.market_cap_rank
  }));
};
