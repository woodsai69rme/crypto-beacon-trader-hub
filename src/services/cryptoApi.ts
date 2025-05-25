
import { CryptoData, CryptoChartData, CoinOption } from "@/types/trading";
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

// Export the function so it can be used in tests
export { getMockCryptoData };

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

export const fetchCoinHistory = async (coinId: string, days: string = '30'): Promise<CryptoChartData> => {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch coin history from CoinGecko');
    }
    
    const data = await response.json();
    return {
      timestamps: data.prices?.map((price: [number, number]) => new Date(price[0]).toISOString()) || [],
      prices: data.prices?.map((price: [number, number]) => price[1]) || [],
      volumes: data.total_volumes?.map((volume: [number, number]) => volume[1]) || []
    };
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

export const fetchCoinHistoryFromCoinGecko = fetchCoinHistory;

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

export const fetchTopCoins = async (limit: number = 100): Promise<CoinOption[]> => {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch top coins');
    }
    
    const data = await response.json();
    return data.map((coin: any): CoinOption => ({
      id: coin.id,
      symbol: coin.symbol?.toUpperCase() || '',
      name: coin.name || '',
      price: coin.current_price || 0,
      priceChange: coin.price_change_24h || 0,
      changePercent: coin.price_change_percentage_24h || 0,
      volume: coin.total_volume || 0,
      marketCap: coin.market_cap || 0,
      image: coin.image,
      value: coin.id,
      label: `${coin.name} (${coin.symbol?.toUpperCase()})`
    }));
  } catch (error) {
    console.error('Error fetching top coins:', error);
    return getMockCryptoData().slice(0, limit);
  }
};
