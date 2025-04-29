
// Cache for API responses
const apiCache: Map<string, { data: any; timestamp: number }> = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Clears the API cache
 */
export const clearApiCache = () => {
  apiCache.clear();
  console.log("API cache cleared");
};

/**
 * Fetches data from an API with caching
 */
export const fetchWithCache = async (url: string, options?: RequestInit) => {
  // Check if we have a cached response
  const cachedResponse = apiCache.get(url);
  const now = Date.now();

  if (cachedResponse && now - cachedResponse.timestamp < CACHE_DURATION) {
    console.log(`Using cached response for ${url}`);
    return cachedResponse.data;
  }

  // No cache or cache expired, fetch fresh data
  console.log(`Fetching fresh data for ${url}`);
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Cache the response
    apiCache.set(url, { data, timestamp: now });
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

/**
 * Enhanced API for cryptocurrency data
 */
export const enhancedCryptoApi = {
  /**
   * Fetches a list of cryptocurrencies with market data
   */
  getCoins: async (currency = "usd", perPage = 100, page = 1) => {
    return fetchWithCache(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=1h,24h,7d`
    );
  },

  /**
   * Fetches detailed data for a specific coin
   */
  getCoin: async (coinId: string) => {
    return fetchWithCache(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false`
    );
  },

  /**
   * Fetches historical price data for a coin
   */
  getCoinHistory: async (coinId: string, days = 7) => {
    return fetchWithCache(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
  },

  /**
   * Searches for coins, categories, and markets
   */
  search: async (query: string) => {
    return fetchWithCache(
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`
    );
  },

  /**
   * Gets trending coins
   */
  getTrending: async () => {
    return fetchWithCache(`https://api.coingecko.com/api/v3/search/trending`);
  },

  /**
   * Gets global market data
   */
  getGlobalData: async () => {
    return fetchWithCache(`https://api.coingecko.com/api/v3/global`);
  }
};
