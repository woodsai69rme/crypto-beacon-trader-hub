
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

// Mock data generator function
const getMockCryptoData = (): CryptoData[] => {
  return [
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 45000,
      priceChange: 1000,
      changePercent: 2.2,
      volume: 25000000000,
      marketCap: 850000000000,
      rank: 1,
      value: 'bitcoin',
      label: 'Bitcoin (BTC)'
    },
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3200,
      priceChange: 150,
      changePercent: 4.9,
      volume: 15000000000,
      marketCap: 380000000000,
      rank: 2,
      value: 'ethereum',
      label: 'Ethereum (ETH)'
    }
  ];
};

export const fetchCoinsFromCoinGecko = async (limit: number = 10): Promise<CryptoData[]> => {
  try {
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
    
    return getMockCryptoData().slice(0, limit);
  }
};

export const fetchCoinHistoryFromCoinGecko = async (coinId: string, days: string = '30'): Promise<CryptoChartData> => {
  try {
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
    
    return {
      timestamps: [],
      prices: [],
      volumes: []
    };
  }
};

export const searchCoinsFromCoinGecko = async (query: string): Promise<CryptoData[]> => {
  try {
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
      rank: coin.market_cap_rank,
      price: 0,
      priceChange: 0,
      changePercent: 0,
      volume: 0,
      marketCap: 0,
      value: coin.id,
      label: `${coin.name} (${coin.symbol.toUpperCase()})`
    })) as CryptoData[];
  } catch (error) {
    console.error("Error searching from CoinGecko:", error);
    toast({
      title: "API Error",
      description: "Could not search CoinGecko API. Using mock data instead.",
      variant: "destructive",
    });
    
    const mockData = getMockCryptoData();
    return mockData.filter(coin => 
      coin.name.toLowerCase().includes(query.toLowerCase()) || 
      coin.symbol.toLowerCase().includes(query.toLowerCase())
    );
  }
};
