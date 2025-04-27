
// Simple cache service for API responses

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class ApiCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  
  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns The cached value or null if not found or expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  /**
   * Set a value in the cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Time to live in milliseconds
   */
  set<T>(key: string, value: T, ttl: number): void {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { data: value, expiresAt });
  }
  
  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Delete a specific entry from the cache
   * @param key Cache key
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  /**
   * Get the number of entries in the cache
   */
  get size(): number {
    return this.cache.size;
  }
  
  /**
   * Check if a key exists in the cache and is not expired
   * @param key Cache key
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
}

// Export a singleton instance
const apiCache = new ApiCache();
export default apiCache;
