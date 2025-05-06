
import axios from 'axios';
import { CoinOption } from '@/types/trading';

export const fetchCryptoData = async (currency = 'usd', limit = 50): Promise<CoinOption[]> => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: currency,
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h',
        },
      }
    );
    
    return response.data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      priceChange: coin.price_change_24h || 0,
      changePercent: coin.price_change_percentage_24h || 0,
      image: coin.image,
      volume: coin.total_volume,
      marketCap: coin.market_cap,
      value: coin.id,
      label: `${coin.name} (${coin.symbol.toUpperCase()})`,
    }));
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return [];
  }
};

export const fetchCoinDetails = async (coinId: string, currency = 'usd'): Promise<any> => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}`,
      {
        params: {
          localization: false,
          tickers: true,
          market_data: true,
          community_data: true,
          developer_data: false,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching coin details for ${coinId}:`, error);
    return null;
  }
};

export const fetchCoinHistory = async (
  coinId: string, 
  days: number | string = 7, 
  currency = 'usd'
): Promise<any> => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: currency,
          days: days,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching coin history for ${coinId}:`, error);
    return { prices: [], market_caps: [], total_volumes: [] };
  }
};
