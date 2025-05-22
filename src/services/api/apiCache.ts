
// API Cache service for optimizing repeated API requests

// Cache configuration
interface CacheConfig {
  maxAge: number; // Maximum age of cache entries in milliseconds
  maxSize: number; // Maximum number of entries in the cache
}

// Cache entry structure
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  key: string;
}

// Default cache configuration
const defaultConfig: CacheConfig = {
  maxAge: 60 * 1000, // 1 minute by default
  maxSize: 100 // Maximum 100 entries
};

/**
 * API Cache for storing API responses
 */
class ApiCache {
  private cache: Map<string, CacheEntry<any>>;
  private config: CacheConfig;
  
  constructor(config?: Partial<CacheConfig>) {
    this.cache = new Map();
    this.config = { ...defaultConfig, ...config };
  }
  
  /**
   * Set a value in the cache
   * @param key - Cache key
   * @param data - Data to cache
   */
  set<T>(key: string, data: T): void {
    // If cache is at max size, remove oldest entry
    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.getOldestKey();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      key
    });
  }
  
  /**
   * Get a value from the cache
   * @param key - Cache key
   * @returns The cached value or null if not found or expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if entry is expired
    if (Date.now() - entry.timestamp > this.config.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  /**
   * Check if a key exists in the cache and is not expired
   * @param key - Cache key
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    // Check if entry is expired
    if (Date.now() - entry.timestamp > this.config.maxAge) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
  
  /**
   * Remove a key from the cache
   * @param key - Cache key
   */
  remove(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get the number of entries in the cache
   */
  size(): number {
    return this.cache.size;
  }
  
  /**
   * Update the cache configuration
   * @param config - New configuration settings
   */
  updateConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * Get the oldest key in the cache
   * @returns The oldest key or null if cache is empty
   */
  private getOldestKey(): string | null {
    if (this.cache.size === 0) {
      return null;
    }
    
    let oldestTimestamp = Date.now();
    let oldestKey: string | null = null;
    
    this.cache.forEach((entry) => {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = entry.key;
      }
    });
    
    return oldestKey;
  }
}

// Create and export a singleton instance
export const apiCache = new ApiCache();

// Export the class for testing and custom instantiation
export default ApiCache;
