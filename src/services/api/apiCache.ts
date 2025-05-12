
// API Cache Service
// Provides local caching for API responses to reduce API calls

// Cache structure: { endpoint: { params: { data, timestamp } } }
interface CacheEntry {
  data: any;
  timestamp: number;
}

interface EndpointCache {
  [paramsKey: string]: CacheEntry;
}

interface ApiCache {
  [endpoint: string]: EndpointCache;
}

class ApiCacheService {
  private cache: ApiCache = {};
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  // Convert params object to string for use as a cache key
  private getParamsKey(params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) {
      return 'default';
    }
    return JSON.stringify(params);
  }
  
  // Get data from cache
  get(endpoint: string, params?: Record<string, any>, ttl: number = this.defaultTTL): any | null {
    const now = Date.now();
    const paramsKey = this.getParamsKey(params);
    
    // Check if endpoint exists in cache
    if (!this.cache[endpoint]) {
      return null;
    }
    
    // Check if params exist for this endpoint
    const endpointCache = this.cache[endpoint];
    if (!endpointCache[paramsKey]) {
      return null;
    }
    
    // Check if cache entry is still valid
    const entry = endpointCache[paramsKey];
    if (now - entry.timestamp > ttl) {
      // Cache expired
      return null;
    }
    
    return entry.data;
  }
  
  // Set data in cache
  set(endpoint: string, data: any, params?: Record<string, any>): void {
    const paramsKey = this.getParamsKey(params);
    
    // Create endpoint cache if it doesn't exist
    if (!this.cache[endpoint]) {
      this.cache[endpoint] = {};
    }
    
    // Store data with timestamp
    this.cache[endpoint][paramsKey] = {
      data,
      timestamp: Date.now()
    };
  }
  
  // Check if data exists in cache and is not expired
  has(endpoint: string, params?: Record<string, any>, ttl: number = this.defaultTTL): boolean {
    return this.get(endpoint, params, ttl) !== null;
  }
  
  // Remove specific entry from cache
  remove(endpoint: string, params?: Record<string, any>): void {
    const paramsKey = this.getParamsKey(params);
    
    if (this.cache[endpoint] && this.cache[endpoint][paramsKey]) {
      delete this.cache[endpoint][paramsKey];
    }
  }
  
  // Clear all entries for a specific endpoint
  clearEndpoint(endpoint: string): void {
    if (this.cache[endpoint]) {
      delete this.cache[endpoint];
    }
  }
  
  // Clear entire cache
  clearAll(): void {
    this.cache = {};
  }
  
  // Set default TTL for cache entries
  setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }
  
  // Get cache statistics
  getStats(): { endpoints: number; entries: number; size: string } {
    const endpoints = Object.keys(this.cache).length;
    let entries = 0;
    
    for (const endpoint in this.cache) {
      entries += Object.keys(this.cache[endpoint]).length;
    }
    
    // Estimate size in KB (rough calculation)
    const sizeInBytes = JSON.stringify(this.cache).length;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    
    return {
      endpoints,
      entries,
      size: `${sizeInKB} KB`
    };
  }
}

// Export singleton instance
const apiCache = new ApiCacheService();
export default apiCache;
