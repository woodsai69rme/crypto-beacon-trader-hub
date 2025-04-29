
interface CacheItem<T> {
  value: T;
  expiry: number;
}

class ApiCache {
  private cache: Map<string, CacheItem<any>> = new Map();
  private readonly maxItems: number = 100;
  private readonly storagePrefix: string = 'crypto-api-cache:';
  private readonly useLocalStorage: boolean = true;

  constructor() {
    this.loadCacheFromStorage();
  }

  private loadCacheFromStorage(): void {
    if (!this.useLocalStorage) return;
    
    try {
      // Get all relevant items from localStorage
      const cacheKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storagePrefix)) {
          cacheKeys.push(key);
        }
      }
      
      // Load each item into memory cache
      cacheKeys.forEach(fullKey => {
        const key = fullKey.slice(this.storagePrefix.length);
        const item = localStorage.getItem(fullKey);
        if (item) {
          const parsed: CacheItem<any> = JSON.parse(item);
          
          // Only add non-expired items
          if (parsed.expiry > Date.now()) {
            this.cache.set(key, parsed);
          } else {
            // Clean up expired items
            localStorage.removeItem(fullKey);
          }
        }
      });
      
      console.log(`Loaded ${this.cache.size} items from cache`);
    } catch (error) {
      console.error("Failed to load cache from storage:", error);
      // Clear any potentially corrupted cache
      this.clear();
    }
  }

  public set<T>(key: string, value: T, ttlMs: number = 60000): void {
    const expiry = Date.now() + ttlMs;
    const item: CacheItem<T> = { value, expiry };
    
    // Memory cache
    this.cache.set(key, item);
    
    // Local storage (if enabled)
    if (this.useLocalStorage) {
      try {
        localStorage.setItem(
          `${this.storagePrefix}${key}`, 
          JSON.stringify(item)
        );
      } catch (error) {
        console.error("Failed to store in localStorage:", error);
        // If storage is full, clear some space
        if (error instanceof DOMException && error.name === "QuotaExceededError") {
          this.pruneOldestItems(10);
          // Try again
          try {
            localStorage.setItem(
              `${this.storagePrefix}${key}`, 
              JSON.stringify(item)
            );
          } catch (retryError) {
            console.error("Failed to store in localStorage after pruning:", retryError);
          }
        }
      }
    }
    
    // If we've reached the item limit, remove the oldest item
    if (this.cache.size > this.maxItems) {
      this.pruneOldestItems(1);
    }
  }

  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    // Return null if item doesn't exist or is expired
    if (!item || item.expiry < Date.now()) {
      // Clean up expired item
      if (item) {
        this.delete(key);
      }
      return null;
    }
    
    return item.value;
  }

  public delete(key: string): void {
    this.cache.delete(key);
    
    if (this.useLocalStorage) {
      localStorage.removeItem(`${this.storagePrefix}${key}`);
    }
  }

  public clear(): void {
    this.cache.clear();
    
    if (this.useLocalStorage) {
      // Only clear items with our prefix
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.storagePrefix)) {
          localStorage.removeItem(key);
        }
      }
    }
  }

  private pruneOldestItems(count: number): void {
    const keys = Array.from(this.cache.keys());
    const itemsToRemove = Math.min(count, keys.length);
    
    for (let i = 0; i < itemsToRemove; i++) {
      this.delete(keys[i]);
    }
  }

  public getCacheSize(): number {
    return this.cache.size;
  }
}

const apiCache = new ApiCache();
export default apiCache;
