
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class ApiCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if the entry has expired
    if (entry.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  /**
   * Set a value in the cache with an expiry time
   */
  set<T>(key: string, data: T, ttl: number): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }

  /**
   * Remove a specific entry from the cache
   */
  remove(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Check if the cache contains a key
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    // Check if the entry has expired
    if (entry.expiry < Date.now()) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Get the size of the cache
   */
  size(): number {
    // Clean expired entries first
    this.cleanExpired();
    return this.cache.size;
  }

  /**
   * Clean all expired entries
   */
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry < now) {
        this.cache.delete(key);
      }
    }
  }
}

const apiCache = new ApiCache();
export default apiCache;
