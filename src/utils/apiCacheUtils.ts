
import apiCache from "@/services/api/cacheService";

/**
 * Helper to get cached data from the cache service
 * 
 * @param key The cache key to retrieve data for
 * @returns The cached data or undefined if not found or expired
 */
export const getCachedData = <T>(key: string | undefined): T | undefined => {
  if (!key) return undefined;
  
  try {
    return apiCache.get<T>(key) || undefined;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn(`Failed to retrieve cached data for key "${key}": ${errorMsg}`);
    return undefined;
  }
};

/**
 * Helper to cache data with the cache service
 * 
 * @param key The cache key to store data under
 * @param data The data to cache
 * @param duration The duration in milliseconds to cache the data
 */
export const cacheData = <T>(key: string | undefined, data: T, duration: number): void => {
  if (!key) return;
  
  try {
    apiCache.set<T>(key, data, duration);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.warn(`Failed to cache data for key "${key}": ${errorMsg}`);
  }
};

/**
 * Builds a custom cache key based on function arguments
 * 
 * @param baseKey The base key to use
 * @param args Any additional arguments to include in the cache key
 * @returns A cache key string
 */
export function buildApiCacheKey(baseKey: string, ...args: any[]): string {
  if (!baseKey) {
    throw new Error("Base cache key cannot be empty");
  }
  
  try {
    return `${baseKey}_${args.map(arg => JSON.stringify(arg)).join('_')}`;
  } catch (error) {
    console.warn("Failed to stringify cache key components, using fallback", error);
    // Fallback to a simpler key generation approach
    return `${baseKey}_${Date.now()}`;
  }
}

/**
 * Clears all cached data with keys that match the provided pattern
 * 
 * @param pattern A string pattern to match cache keys against
 */
export function clearCacheByPattern(pattern: string): void {
  try {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(k => k.startsWith('api_cache_') && k.includes(pattern));
    
    cacheKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log(`Cleared ${cacheKeys.length} cache items matching pattern "${pattern}"`);
  } catch (error) {
    console.warn(`Failed to clear cache by pattern "${pattern}"`, error);
  }
}
