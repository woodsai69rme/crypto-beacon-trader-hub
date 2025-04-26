
import apiCache from "@/services/api/cacheService";

/**
 * Helper to get cached data from the cache service
 */
export const getCachedData = <T>(key: string | undefined): T | undefined => {
  if (!key) return undefined;
  return apiCache.get<T>(key) || undefined;
};

/**
 * Helper to cache data with the cache service
 */
export const cacheData = <T>(key: string | undefined, data: T, duration: number): void => {
  if (!key) return;
  apiCache.set<T>(key, data, duration);
};

/**
 * Builds a custom cache key based on function arguments
 */
export function buildApiCacheKey(baseKey: string, ...args: any[]): string {
  return `${baseKey}_${args.map(arg => JSON.stringify(arg)).join('_')}`;
}
