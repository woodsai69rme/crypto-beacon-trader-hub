
/**
 * Simple in-memory cache service for API responses
 */
interface CacheItem<T> {
  value: T;
  timestamp: number;
  expiry: number; // Expiry time in milliseconds
}

class ApiCache {
  private cache: Record<string, CacheItem<any>> = {};
  private maxItems: number = 100;
  
  /**
   * Get an item from the cache
   * @param key Cache key
   * @returns Cached value or undefined if not found or expired
   */
  public get<T>(key: string): T | undefined {
    const item = this.cache[key];
    
    // If item doesn't exist or has expired
    if (!item || Date.now() > item.expiry) {
      if (item) {
        // Clean up expired item
        delete this.cache[key];
      }
      return undefined;
    }
    
    return item.value;
  }
  
  /**
   * Set an item in the cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Time to live in milliseconds
   */
  public set<T>(key: string, value: T, ttl: number = 60000): void {
    // Clean up if cache is full
    if (Object.keys(this.cache).length >= this.maxItems) {
      this.cleanup();
    }
    
    this.cache[key] = {
      value,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    };
  }
  
  /**
   * Remove an item from the cache
   * @param key Cache key
   */
  public remove(key: string): void {
    delete this.cache[key];
  }
  
  /**
   * Clear all items from the cache
   */
  public clear(): void {
    this.cache = {};
  }
  
  /**
   * Check if a key exists in the cache and is not expired
   * @param key Cache key
   * @returns True if key exists and is not expired
   */
  public has(key: string): boolean {
    const item = this.cache[key];
    return !!item && Date.now() <= item.expiry;
  }
  
  /**
   * Cleanup the cache by removing expired items and oldest items if needed
   * @param forceCleanup Force cleanup even if cache is not full
   */
  private cleanup(forceCleanup: boolean = false): void {
    const now = Date.now();
    const keys = Object.keys(this.cache);
    
    // No need to clean if cache is not full and not forced
    if (keys.length < this.maxItems && !forceCleanup) {
      return;
    }
    
    // First remove expired items
    keys.forEach(key => {
      if (now > this.cache[key].expiry) {
        delete this.cache[key];
      }
    });
    
    // If still too many items, remove oldest
    if (Object.keys(this.cache).length >= this.maxItems) {
      // Sort by timestamp (oldest first)
      const sortedKeys = keys.sort((a, b) => 
        this.cache[a].timestamp - this.cache[b].timestamp
      );
      
      // Remove oldest items to get to 75% of max capacity
      const removeCount = Math.floor(this.maxItems * 0.25);
      sortedKeys.slice(0, removeCount).forEach(key => {
        delete this.cache[key];
      });
    }
  }
}

// Export a singleton instance
const apiCache = new ApiCache();
export default apiCache;
