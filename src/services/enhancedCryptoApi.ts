
/**
 * Enhanced Crypto API service
 * Provides extended functionality for crypto data fetching with caching
 */

// Store API response cache
const apiCache: Record<string, { data: any; timestamp: number }> = {};

/**
 * Clear all stored API cache data
 * Useful for forcing fresh data fetches
 */
export const clearApiCache = () => {
  Object.keys(apiCache).forEach((key) => {
    delete apiCache[key];
  });
  console.log("API cache cleared successfully");
  return true;
};

/**
 * Fetch data with caching capability
 * @param url API endpoint URL 
 * @param cacheDuration Duration in milliseconds for cache validity
 */
export const fetchWithCache = async (url: string, cacheDuration = 5 * 60 * 1000) => {
  const now = Date.now();
  
  // Return cached data if valid
  if (apiCache[url] && now - apiCache[url].timestamp < cacheDuration) {
    return apiCache[url].data;
  }
  
  // Fetch fresh data
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Update cache
  apiCache[url] = { data, timestamp: now };
  
  return data;
};
