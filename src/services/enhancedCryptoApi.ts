
import axios from 'axios';

// API cache management
const apiCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const clearApiCache = () => {
  Object.keys(apiCache).forEach((key) => {
    delete apiCache[key];
  });
};

export const fetchCryptoData = async (endpoint: string, params: Record<string, any> = {}) => {
  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
  
  // Check if we have cached data that's still valid
  if (apiCache[cacheKey] && Date.now() - apiCache[cacheKey].timestamp < CACHE_EXPIRY) {
    return apiCache[cacheKey].data;
  }
  
  try {
    // If no valid cache, make the API request
    const response = await axios.get(`https://api.coingecko.com/api/v3/${endpoint}`, { params });
    
    // Cache the result
    apiCache[cacheKey] = {
      data: response.data,
      timestamp: Date.now()
    };
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

export const searchCoins = async (query: string) => {
  if (!query || query.length < 2) return [];
  
  try {
    const data = await fetchCryptoData('search', { query });
    return data.coins.slice(0, 10).map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.large || `https://assets.coingecko.com/coins/images/1/large/${coin.id}.png`,
      market_cap_rank: coin.market_cap_rank
    }));
  } catch (error) {
    console.error('Error searching coins:', error);
    return [];
  }
};
