
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

// Add the missing function for historical data
export const fetchCryptoHistoricalData = async (
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
    console.error(`Error fetching historical data for ${coinId}:`, error);
    return { prices: [], market_caps: [], total_volumes: [] };
  }
};

// Alias for backward compatibility
export const fetchCoinHistory = fetchCryptoHistoricalData;

// Helper function for converting API response to coin options
export const convertToCoinOptions = (data: any[]): CoinOption[] => {
  return data.map((coin: any) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    price: coin.current_price || coin.price || 0,
    priceChange: coin.price_change_24h || 0,
    changePercent: coin.price_change_percentage_24h || 0,
    image: coin.image,
    volume: coin.total_volume || coin.volume || 0,
    marketCap: coin.market_cap || 0,
    value: coin.id,
    label: `${coin.name} (${coin.symbol.toUpperCase()})`,
  }));
};

// Helper function for fetching multiple coins
export const fetchMultipleCryptoData = async (coinIds: string[], currency = 'usd'): Promise<CoinOption[]> => {
  try {
    const idsParam = coinIds.join(',');
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets`,
      {
        params: {
          vs_currency: currency,
          ids: idsParam,
          order: 'market_cap_desc',
          sparkline: false,
          price_change_percentage: '24h',
        },
      }
    );
    
    return convertToCoinOptions(response.data);
  } catch (error) {
    console.error('Error fetching multiple crypto data:', error);
    return [];
  }
};
