
import { toast } from "@/components/ui/use-toast";
import { CoinOption, CryptoData, CryptoChartData } from "@/types/trading";

// Define the CryptoData type that is used by multiple components
export interface ExtendedCryptoData {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation?: number | null;
  total_volume?: number;
  high_24h?: number | null;
  low_24h?: number | null;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  market_cap_change_24h?: number;
  market_cap_change_percentage_24h?: number;
  circulating_supply?: number;
  total_supply?: number | null;
  max_supply?: number | null;
  ath?: number | null;
  ath_change_percentage?: number | null;
  ath_date?: string | null;
  atl?: number | null;
  atl_change_percentage?: number | null;
  atl_date?: string | null;
  roi?: any | null;
  last_updated?: string;
  priceAUD?: number;
  priceEUR?: number;
  priceGBP?: number;
}

// Export the types from trading.d.ts again to ensure all imports work
export type { CryptoData, CryptoChartData } from "@/types/trading";

// Export the correct function names that components are trying to use
export const fetchCoinHistory = async (coinId: string, days: number = 7): Promise<CryptoChartData> => {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
    if (!response.ok) throw new Error('Failed to fetch coin history');
    return await response.json();
  } catch (error) {
    console.error('Error fetching coin history:', error);
    throw error;
  }
};

export const fetchTopCoins = async (limit: number = 20): Promise<CoinOption[]> => {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&sparkline=false`);
    if (!response.ok) throw new Error('Failed to fetch top coins');
    const data = await response.json();
    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      priceChange: coin.price_change_24h,
      changePercent: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      volume: coin.total_volume,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank
    }));
  } catch (error) {
    console.error('Error fetching top coins:', error);
    throw error;
  }
};

export const searchCoins = async (query: string): Promise<CoinOption[]> => {
  if (!query) return [];
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`);
    if (!response.ok) throw new Error('Failed to search coins');
    const data = await response.json();
    return data.coins.slice(0, 10).map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: 0, // Price needs to be fetched separately
      priceChange: 0,
      changePercent: 0,
      marketCap: 0,
      volume: 0,
      image: coin.large
    }));
  } catch (error) {
    console.error('Error searching coins:', error);
    throw error;
  }
};

// Add a mock data function for fallback use
export const getMockCryptoData = (limit: number = 20): CryptoData[] => {
  const coins = [
    { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 61245.32 },
    { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 3010.45 },
    { id: "solana", symbol: "SOL", name: "Solana", price: 142.87 },
    { id: "cardano", symbol: "ADA", name: "Cardano", price: 0.45 },
    { id: "ripple", symbol: "XRP", name: "XRP", price: 0.57 },
    { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", price: 0.14 },
    { id: "polkadot", symbol: "DOT", name: "Polkadot", price: 7.32 },
    { id: "chainlink", symbol: "LINK", name: "Chainlink", price: 14.54 },
    { id: "litecoin", symbol: "LTC", name: "Litecoin", price: 82.45 },
    { id: "stellar", symbol: "XLM", name: "Stellar", price: 0.12 },
  ];
  
  // Convert to CryptoData format
  return coins.slice(0, limit).map((coin, index) => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    image: `https://example.com/placeholder/${coin.id}.png`,
    current_price: coin.price,
    market_cap: coin.price * 1000000 * (20 - index),
    market_cap_rank: index + 1,
    price_change_24h: index % 2 === 0 ? coin.price * 0.05 : -coin.price * 0.03,
    price_change_percentage_24h: index % 2 === 0 ? 5 : -3,
    marketCap: coin.price * 1000000 * (20 - index),
    priceChange: index % 2 === 0 ? coin.price * 0.05 : -coin.price * 0.03,
    changePercent: index % 2 === 0 ? 5 : -3,
    price: coin.price
  }));
};
