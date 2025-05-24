
import axios from 'axios';
import { CryptoData, CryptoChartData } from '@/types/trading';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchTopCryptos = async (limit: number = 100): Promise<CryptoData[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: false
      }
    });

    return response.data.map((coin: any): CryptoData => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price || 0,
      priceChange: coin.price_change_24h || 0,
      changePercent: coin.price_change_percentage_24h || 0,
      volume: coin.total_volume || 0,
      marketCap: coin.market_cap || 0,
      rank: coin.market_cap_rank || 0,
      image: coin.image,
      value: coin.id,
      label: `${coin.name} (${coin.symbol.toUpperCase()})`
    }));
  } catch (error) {
    console.error('Error fetching top cryptos:', error);
    return [];
  }
};

export const fetchMultipleCryptos = async (coinIds: string[]): Promise<CryptoData[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: coinIds.join(','),
        order: 'market_cap_desc',
        per_page: coinIds.length,
        page: 1,
        sparkline: false
      }
    });

    return response.data.map((coin: any): CryptoData => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price || 0,
      priceChange: coin.price_change_24h || 0,
      changePercent: coin.price_change_percentage_24h || 0,
      volume: coin.total_volume || 0,
      marketCap: coin.market_cap || 0,
      rank: coin.market_cap_rank || 0,
      image: coin.image,
      value: coin.id,
      label: `${coin.name} (${coin.symbol.toUpperCase()})`
    }));
  } catch (error) {
    console.error('Error fetching multiple cryptos:', error);
    return [];
  }
};

export const fetchCoinHistory = async (coinId: string, days: string = '30'): Promise<CryptoChartData> => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days
      }
    });

    const timestamps = response.data.prices.map((price: [number, number]) => 
      new Date(price[0]).toISOString()
    );
    const prices = response.data.prices.map((price: [number, number]) => price[1]);
    const volumes = response.data.total_volumes?.map((volume: [number, number]) => volume[1]) || [];

    return {
      timestamps,
      prices,
      volumes
    };
  } catch (error) {
    console.error('Error fetching coin history:', error);
    return {
      timestamps: [],
      prices: [],
      volumes: []
    };
  }
};

export const searchCoins = async (query: string): Promise<CryptoData[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: { query }
    });

    return response.data.coins.slice(0, 10).map((coin: any): CryptoData => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: 0,
      priceChange: 0,
      changePercent: 0,
      volume: 0,
      marketCap: coin.market_cap_rank || 0,
      rank: coin.market_cap_rank || 0,
      image: coin.thumb,
      value: coin.id,
      label: `${coin.name} (${coin.symbol.toUpperCase()})`
    }));
  } catch (error) {
    console.error('Error searching coins:', error);
    return [];
  }
};

export const fetchCoinDetails = async (coinId: string): Promise<CryptoData | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false
      }
    });

    const coin = response.data;
    return {
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.market_data?.current_price?.usd || 0,
      priceChange: coin.market_data?.price_change_24h || 0,
      changePercent: coin.market_data?.price_change_percentage_24h || 0,
      volume: coin.market_data?.total_volume?.usd || 0,
      marketCap: coin.market_data?.market_cap?.usd || 0,
      rank: coin.market_cap_rank || 0,
      image: coin.image?.large,
      value: coin.id,
      label: `${coin.name} (${coin.symbol.toUpperCase()})`
    };
  } catch (error) {
    console.error('Error fetching coin details:', error);
    return null;
  }
};

// Export the chart data function name that components expect
export const getCoinChartData = fetchCoinHistory;

export default {
  fetchTopCryptos,
  fetchMultipleCryptos,
  fetchCoinHistory,
  getCoinChartData,
  searchCoins,
  fetchCoinDetails
};
