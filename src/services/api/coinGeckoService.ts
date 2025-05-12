
import { CryptoData, CryptoChartData } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";

// Mock API key storage
let apiKey: string | null = null;

export const setCoinGeckoApiKey = (key: string) => {
  apiKey = key;
  localStorage.setItem('coinGeckoApiKey', key);
  return true;
};

export const getCoinGeckoApiKey = (): string | null => {
  if (!apiKey) {
    apiKey = localStorage.getItem('coinGeckoApiKey');
  }
  return apiKey;
};

export const fetchCoinsFromCoinGecko = async (limit: number = 10): Promise<CryptoData[]> => {
  try {
    // In a real app, we would use the API key
    // For now, returning mock data
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch coins from CoinGecko');
    }
    
    const data = await response.json();
    return data as CryptoData[];
  } catch (error) {
    console.error("Error fetching from CoinGecko:", error);
    toast({
      title: "API Error",
      description: "Could not fetch data from CoinGecko API. Using mock data instead.",
      variant: "destructive",
    });
    
    // Fallback to local mock data
    return import("../cryptoApi").then(module => module.getMockCryptoData().slice(0, limit));
  }
};

export const fetchCoinHistoryFromCoinGecko = async (coinId: string, days: number = 30): Promise<CryptoChartData> => {
  try {
    // In a real app, we would use the API key
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch coin history from CoinGecko');
    }
    
    const data = await response.json();
    return data as CryptoChartData;
  } catch (error) {
    console.error("Error fetching from CoinGecko:", error);
    toast({
      title: "API Error",
      description: "Could not fetch historical data from CoinGecko API. Using mock data instead.",
      variant: "destructive",
    });
    
    // Fallback to local mock data
    return import("../cryptoApi").then(module => module.fetchCoinHistory(coinId, days));
  }
};

export const searchCoinsFromCoinGecko = async (query: string): Promise<CryptoData[]> => {
  try {
    // In a real app, we would use the API key
    const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`);
    
    if (!response.ok) {
      throw new Error('Failed to search coins from CoinGecko');
    }
    
    const data = await response.json();
    return data.coins.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.large,
      market_cap_rank: coin.market_cap_rank,
    })) as Partial<CryptoData>[] as CryptoData[];
  } catch (error) {
    console.error("Error searching from CoinGecko:", error);
    toast({
      title: "API Error",
      description: "Could not search CoinGecko API. Using mock data instead.",
      variant: "destructive",
    });
    
    // Fallback to local mock data
    return import("../cryptoApi").then(module => {
      const mockData = module.getMockCryptoData();
      return mockData.filter(coin => 
        coin.name.toLowerCase().includes(query.toLowerCase()) || 
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      );
    });
  }
};
