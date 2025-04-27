
interface CacheItem<T> {
  data: T;
  expiry: number;
}

class ApiCache {
  private cache: Map<string, CacheItem<any>> = new Map();
  private maxSize: number = 100; // Maximum number of items to store
  
  /**
   * Get an item from the cache
   * @param key Cache key
   * @returns The cached value or undefined if not found or expired
   */
  public get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    
    // Return undefined if item doesn't exist or has expired
    if (!item || Date.now() > item.expiry) {
      if (item) {
        // Clean up expired items
        this.cache.delete(key);
      }
      return undefined;
    }
    
    return item.data as T;
  }
  
  /**
   * Set an item in the cache
   * @param key Cache key
   * @param data Data to cache
   * @param ttl Time to live in milliseconds
   */
  public set<T>(key: string, data: T, ttl: number): void {
    // Ensure we don't exceed the max cache size
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }
    
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }
  
  /**
   * Delete an item from the cache
   * @param key Cache key
   */
  public delete(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * Clear all items from the cache
   */
  public clear(): void {
    this.cache.clear();
  }
  
  /**
   * Check if the cache contains a non-expired key
   * @param key Cache key
   * @returns True if the key exists and is not expired
   */
  public has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expiry) {
      return false;
    }
    return true;
  }
  
  /**
   * Get the number of items in the cache
   * @returns Number of cached items
   */
  public size(): number {
    return this.cache.size;
  }
  
  /**
   * Evict the oldest item from the cache
   */
  private evictOldest(): void {
    // Get the first key (oldest by insertion order in Map)
    const oldestKey = this.cache.keys().next().value;
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }
  
  /**
   * Clean expired items from the cache
   */
  public cleanExpired(): void {
    for (const [key, item] of this.cache.entries()) {
      if (Date.now() > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Create a singleton instance
const apiCache = new ApiCache();

// Set up regular cleanup of expired items
setInterval(() => apiCache.cleanExpired(), 60000); // Clean every minute

export default apiCache;
