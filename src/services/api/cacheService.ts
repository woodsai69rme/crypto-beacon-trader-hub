
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number; // In milliseconds
}

export class ApiCache {
  private cache: Map<string, CacheItem<any>> = new Map();
  
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.timestamp + item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }
  
  set<T>(key: string, data: T, expiry: number = 5 * 60 * 1000): void { // Default 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry
    });
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  clearByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton instance
const apiCache = new ApiCache();
export default apiCache;
