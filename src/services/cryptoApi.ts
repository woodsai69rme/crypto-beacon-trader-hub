
import { CoinOption, CryptoChartData } from "@/types/trading";
import { toast } from "@/components/ui/use-toast";

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
      image: coin.image
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
      marketCap: 0,
      volume: 0,
      image: coin.large
    }));
  } catch (error) {
    console.error('Error searching coins:', error);
    throw error;
  }
};
