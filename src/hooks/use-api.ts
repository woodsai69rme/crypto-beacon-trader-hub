
import { useState, useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface UseApiOptions<T> {
  initialData?: T;
  cacheKey?: string;
  cacheDuration?: number; // in milliseconds
  retries?: number;
  retryDelay?: number; // in milliseconds
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  loadOnMount?: boolean;
  retryIf?: (error: any) => boolean; // Function to determine if retry should happen
}

/**
 * Custom hook for API calls with built-in caching, retries, and loading states
 */
export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const {
    initialData,
    cacheKey,
    cacheDuration = 5 * 60 * 1000, // 5 minutes by default
    retries = 1,
    retryDelay = 1000,
    onSuccess,
    onError,
    onSettled,
    loadOnMount = true,
    retryIf = () => true, // Default to retry all errors
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check cache on mount
  useEffect(() => {
    if (cacheKey && loadOnMount) {
      const cachedData = getCachedData<T>(cacheKey);
      if (cachedData) {
        setData(cachedData);
        return;
      }
    }
    
    if (loadOnMount) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to get cached data
  const getCachedData = <D>(key: string): D | undefined => {
    try {
      const cachedItem = localStorage.getItem(`api_cache_${key}`);
      if (!cachedItem) return undefined;
      
      const { data, timestamp, expiry } = JSON.parse(cachedItem);
      
      // Check if cache is still valid
      if (Date.now() - timestamp < expiry) {
        return data as D;
      }
      
      // Remove expired cache
      localStorage.removeItem(`api_cache_${key}`);
      return undefined;
    } catch (e) {
      console.warn("Error reading from cache", e);
      return undefined;
    }
  };

  // Helper to cache data
  const cacheData = <D>(key: string, data: D): void => {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now(),
        expiry: cacheDuration,
      };
      
      localStorage.setItem(`api_cache_${key}`, JSON.stringify(cacheItem));
    } catch (e) {
      console.warn("Error writing to cache", e);
    }
  };

  // Main fetch function with retry logic
  const executeFetchWithRetries = useCallback(
    async (
      fn: () => Promise<T>,
      retriesLeft: number,
      args: any[] = []
    ): Promise<T> => {
      try {
        return await fn();
      } catch (error) {
        // Check if we should retry
        if (retriesLeft > 0 && retryIf(error)) {
          console.log(`Retrying API call. Attempts remaining: ${retriesLeft}`);
          
          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          
          // Recursive retry
          return executeFetchWithRetries(fn, retriesLeft - 1, args);
        }
        
        // No more retries, propagate the error
        throw error;
      }
    },
    [retryDelay, retryIf]
  );

  // Main fetch data function
  const fetchData = useCallback(
    async (...args: any[]): Promise<T | undefined> => {
      setIsLoading(true);
      setError(null);

      try {
        // Check cache first if cacheKey is provided
        if (cacheKey) {
          const cachedData = getCachedData<T>(cacheKey);
          if (cachedData) {
            setData(cachedData);
            setIsLoading(false);
            
            if (onSuccess) onSuccess(cachedData);
            if (onSettled) onSettled();
            
            return cachedData;
          }
        }

        // Execute API call with retry logic
        const fetchFn = () => apiFunction(...args);
        const result = await executeFetchWithRetries(fetchFn, retries, args);

        // Update state and cache results
        setData(result);
        
        if (cacheKey) {
          cacheData(cacheKey, result);
        }
        
        if (onSuccess) onSuccess(result);
        
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        
        if (onError) onError(error);
        
        // Show toast notification for error
        toast({
          title: "API Error",
          description: error.message,
          variant: "destructive",
        });
        
        return undefined;
      } finally {
        setIsLoading(false);
        if (onSettled) onSettled();
      }
    },
    [
      apiFunction,
      cacheKey,
      cacheDuration,
      executeFetchWithRetries,
      onError,
      onSettled,
      onSuccess,
      retries,
    ]
  );

  // Function to clear the cache for this specific API
  const clearCache = useCallback(() => {
    if (cacheKey) {
      localStorage.removeItem(`api_cache_${cacheKey}`);
      toast({
        title: "Cache Cleared",
        description: "Data will be freshly loaded on next request",
      });
    }
  }, [cacheKey]);

  return {
    data,
    error,
    isLoading,
    fetchData,
    clearCache,
  };
}

// Helper for building a custom cacheKey based on function arguments
export function buildCacheKey(baseKey: string, ...args: any[]): string {
  return `${baseKey}_${args.map(arg => JSON.stringify(arg)).join('_')}`;
}
