import { toast } from "@/components/ui/use-toast";
import { updateWithAUDPrices } from "./currencyApi";

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  image: string;
  ath: number;
  total_volume: number;
  circulating_supply: number;
  priceAUD?: number;
}

export interface CryptoChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

const API_BASE_URL = "https://api.coingecko.com/api/v3";

export const fetchTopCoins = async (limit: number = 20): Promise<CryptoData[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch cryptocurrency data");
    }
    
    const data = await response.json();
    
    // Get AUD conversion rate
    const conversionResponse = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=AUD");
    let audRate = 1.45; // Default fallback rate
    
    if (conversionResponse.ok) {
      const rateData = await conversionResponse.json();
      audRate = rateData.rates.AUD || audRate;
    }
    
    // Add AUD prices to the coin data
    const coinsWithAUD = data.map((coin: any) => ({
      ...coin,
      priceAUD: coin.current_price * audRate
    }));
    
    return coinsWithAUD;
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to fetch cryptocurrency data. Using mock data instead.",
      variant: "destructive",
    });
    console.error("API Error:", error);
    // Return mock data as fallback
    return getMockCryptoData(limit);
  }
};

export const fetchCoinData = async (coinId: string): Promise<CryptoData | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch coin data");
    }
    
    const data = await response.json();
    
    // Get AUD conversion rate
    const conversionResponse = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=AUD");
    let audRate = 1.45; // Default fallback rate
    
    if (conversionResponse.ok) {
      const rateData = await conversionResponse.json();
      audRate = rateData.rates.AUD || audRate;
    }
    
    // Transform to match our interface
    return {
      id: data.id,
      name: data.name,
      symbol: data.symbol.toUpperCase(),
      current_price: data.market_data.current_price.usd,
      market_cap: data.market_data.market_cap.usd,
      market_cap_rank: data.market_cap_rank,
      price_change_percentage_24h: data.market_data.price_change_percentage_24h,
      image: data.image.small,
      ath: data.market_data.ath.usd,
      total_volume: data.market_data.total_volume.usd,
      circulating_supply: data.market_data.circulating_supply,
      priceAUD: data.market_data.current_price.usd * audRate
    };
  } catch (error) {
    toast({
      title: "Error",
      description: `Failed to fetch data for ${coinId}`,
      variant: "destructive",
    });
    console.error("API Error:", error);
    return null;
  }
};

export const searchCoins = async (query: string): Promise<CryptoData[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(`${API_BASE_URL}/search?query=${query}`);
    
    if (!response.ok) {
      throw new Error("Search failed");
    }
    
    const data = await response.json();
    
    // Return the first 10 coins from the search results
    return data.coins.slice(0, 10).map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      market_cap_rank: coin.market_cap_rank || 9999,
      image: coin.large,
      // The search endpoint doesn't return these values, so we set defaults
      current_price: 0,
      market_cap: 0,
      price_change_percentage_24h: 0,
      ath: 0,
      total_volume: 0,
      circulating_supply: 0
    }));
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
};

export const fetchCoinHistory = async (
  coinId: string, 
  days: number = 7
): Promise<CryptoChartData | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch coin history");
    }
    
    return await response.json();
  } catch (error) {
    toast({
      title: "Error",
      description: `Failed to fetch history for ${coinId}`,
      variant: "destructive",
    });
    console.error("API Error:", error);
    return null;
  }
};

// Mock data to use as fallback if API fails
const getMockCryptoData = (limit: number): CryptoData[] => {
  const mockCoins = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      current_price: 29341.52,
      market_cap: 574832781945,
      market_cap_rank: 1,
      price_change_percentage_24h: 2.5,
      image: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
      ath: 69000,
      total_volume: 18500000000,
      circulating_supply: 19500000
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      current_price: 1823.43,
      market_cap: 219234567890,
      market_cap_rank: 2,
      price_change_percentage_24h: 1.2,
      image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
      ath: 4878,
      total_volume: 9700000000,
      circulating_supply: 120200000
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      current_price: 98.65,
      market_cap: 42800000000,
      market_cap_rank: 5,
      price_change_percentage_24h: -0.8,
      image: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
      ath: 260,
      total_volume: 2100000000,
      circulating_supply: 429700000
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      current_price: 0.38,
      market_cap: 13100000000,
      market_cap_rank: 9,
      price_change_percentage_24h: -1.2,
      image: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
      ath: 3.10,
      total_volume: 500000000,
      circulating_supply: 35400000000
    },
    {
      id: "ripple",
      name: "XRP",
      symbol: "XRP",
      current_price: 0.54,
      market_cap: 29200000000,
      market_cap_rank: 6,
      price_change_percentage_24h: 0.6,
      image: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
      ath: 3.40,
      total_volume: 1300000000,
      circulating_supply: 53200000000
    }
  ];
  
  return mockCoins.slice(0, limit);
};
