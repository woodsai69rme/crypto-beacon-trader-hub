
import axios from 'axios';
import { CoinOption } from '@/types/trading';

// Free API endpoints from CoinGecko
const BASE_URL = 'https://api.coingecko.com/api/v3';

// Helper to handle rate limiting with exponential backoff
const fetchWithRetry = async (url: string, retries = 3, delay = 1000) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    // Check if we're being rate limited (429)
    if (error.response && error.response.status === 429 && retries > 0) {
      console.log(`Rate limited. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Get price data for multiple cryptocurrencies
export const fetchCryptoPrices = async (coinIds: string[], currency = 'usd') => {
  try {
    const idsParam = coinIds.join(',');
    const url = `${BASE_URL}/simple/price?ids=${idsParam}&vs_currencies=${currency}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;
    return await fetchWithRetry(url);
  } catch (error) {
    console.error('Failed to fetch crypto prices:', error);
    throw error;
  }
};

// Get top cryptocurrencies by market cap
export const fetchTopCryptoData = async (limit = 10, currency = 'usd'): Promise<CoinOption[]> => {
  try {
    const url = `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`;
    const response = await fetchWithRetry(url);
    
    return response.map((coin: any) => ({
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
      label: `${coin.name} (${coin.symbol.toUpperCase()})`
    }));
  } catch (error) {
    console.error('Failed to fetch top crypto data:', error);
    // Return empty array to avoid breaking the UI
    return [];
  }
};

// Get historical price data for a specific coin
export const fetchCoinHistory = async (coinId: string, days = 7, currency = 'usd') => {
  try {
    const url = `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`;
    return await fetchWithRetry(url);
  } catch (error) {
    console.error(`Failed to fetch history for ${coinId}:`, error);
    throw error;
  }
};

// Get detailed information for a specific coin
export const fetchCoinDetails = async (coinId: string) => {
  try {
    const url = `${BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`;
    return await fetchWithRetry(url);
  } catch (error) {
    console.error(`Failed to fetch details for ${coinId}:`, error);
    throw error;
  }
};

// Search for coins by query
export const searchCoins = async (query: string) => {
  try {
    const url = `${BASE_URL}/search?query=${query}`;
    return await fetchWithRetry(url);
  } catch (error) {
    console.error(`Failed to search for coins with query "${query}":`, error);
    throw error;
  }
};

// Convert API response to our app's CoinOption format
export const convertToCoinOptions = (apiData: any[]): CoinOption[] => {
  return apiData.map(coin => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    price: coin.current_price || 0,
    priceChange: coin.price_change_24h || 0,
    changePercent: coin.price_change_percentage_24h || 0,
    image: coin.image,
    volume: coin.total_volume || 0,
    marketCap: coin.market_cap || 0,
    value: coin.id,
    label: `${coin.name} (${coin.symbol.toUpperCase()})`
  }));
};

// Format price history data from API into PricePoint format
export const formatPriceHistory = (apiData: any): { priceData: any[], marketCapData: any[], volumeData: any[] } => {
  if (!apiData || !apiData.prices) {
    return { priceData: [], marketCapData: [], volumeData: [] };
  }
  
  const priceData = apiData.prices.map((item: [number, number]) => ({
    time: item[0],
    price: item[1]
  }));
  
  const marketCapData = apiData.market_caps.map((item: [number, number]) => ({
    time: item[0],
    value: item[1]
  }));
  
  const volumeData = apiData.total_volumes.map((item: [number, number]) => ({
    time: item[0],
    value: item[1]
  }));
  
  return { priceData, marketCapData, volumeData };
};
