
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

export const getCachedData = <T>(key: string | undefined): T | undefined => {
  if (!key) return undefined;
  
  try {
    const cachedItem = localStorage.getItem(`api_cache_${key}`);
    if (!cachedItem) return undefined;
    
    const { data, timestamp, expiry } = JSON.parse(cachedItem);
    
    // Check if cache is still valid
    if (Date.now() - timestamp < expiry) {
      return data as T;
    }
    
    // Remove expired cache
    localStorage.removeItem(`api_cache_${key}`);
    return undefined;
  } catch (e) {
    console.warn("Error reading from cache", e);
    return undefined;
  }
};

export const cacheData = <T>(
  key: string | undefined, 
  data: T, 
  duration: number
): void => {
  if (!key) return;
  
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
      expiry: duration,
    };
    
    localStorage.setItem(`api_cache_${key}`, JSON.stringify(cacheItem));
  } catch (e) {
    console.warn("Error writing to cache", e);
  }
};
