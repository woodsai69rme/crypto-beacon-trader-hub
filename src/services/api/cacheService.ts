
interface CachedItem<T> {
  data: T;
  expiry: number;
}

class ApiCache {
  private cache: Map<string, CachedItem<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes default TTL

  constructor(defaultTTL?: number) {
    if (defaultTTL) {
      this.defaultTTL = defaultTTL;
    }
    
    // Load any cached data from localStorage
    this.loadFromStorage();
    
    // Set up periodic cleaning of expired items
    setInterval(() => this.cleanExpired(), 60000); // Clean every minute
  }

  private loadFromStorage() {
    try {
      const savedCache = localStorage.getItem('api-cache');
      if (savedCache) {
        const parsed = JSON.parse(savedCache);
        Object.keys(parsed).forEach(key => {
          const item = parsed[key];
          if (item.expiry > Date.now()) { // Only load non-expired items
            this.cache.set(key, item);
          }
        });
      }
    } catch (error) {
      console.error("Error loading cache from storage:", error);
      // If there's an error, clear the cache to prevent future issues
      localStorage.removeItem('api-cache');
    }
  }

  private saveToStorage() {
    try {
      const cacheObj: Record<string, CachedItem<any>> = {};
      this.cache.forEach((value, key) => {
        cacheObj[key] = value;
      });
      localStorage.setItem('api-cache', JSON.stringify(cacheObj));
    } catch (error) {
      console.error("Error saving cache to storage:", error);
    }
  }

  private cleanExpired() {
    const now = Date.now();
    let changed = false;
    
    this.cache.forEach((value, key) => {
      if (value.expiry < now) {
        this.cache.delete(key);
        changed = true;
      }
    });
    
    if (changed) {
      this.saveToStorage();
    }
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    if (item.expiry < Date.now()) {
      this.cache.delete(key);
      this.saveToStorage();
      return null;
    }
    
    return item.data;
  }

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
    
    this.saveToStorage();
  }

  remove(key: string): void {
    this.cache.delete(key);
    this.saveToStorage();
  }

  clear(): void {
    this.cache.clear();
    localStorage.removeItem('api-cache');
  }
}

// Create a single instance to use throughout the app
const apiCache = new ApiCache();
export default apiCache;
