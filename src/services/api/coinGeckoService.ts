
import { CryptoData, CoinOption } from '@/types/trading';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export interface CoinGeckoResponse {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
  market_cap_rank: number;
}

export const fetchCoinGeckoData = async (): Promise<CryptoData[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch CoinGecko data');
    }
    
    const data: CoinGeckoResponse[] = await response.json();
    
    return data.map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      priceChange: coin.price_change_24h,
      changePercent: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      volume: coin.total_volume,
      image: coin.image,
      value: coin.symbol.toUpperCase(),
      label: `${coin.name} (${coin.symbol.toUpperCase()})`,
    }));
  } catch (error) {
    console.error('Error fetching CoinGecko data:', error);
    return [];
  }
};

export const fetchCoinHistory = async (coinId: string, days: string = '7') => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch coin history');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching coin history:', error);
    return null;
  }
};
