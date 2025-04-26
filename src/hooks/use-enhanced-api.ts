
import { useState, useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import apiCache from "@/services/api/cacheService";

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
 * Enhanced API hook with better caching and retry logic
 */
export function useEnhancedApi<T = any>(
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
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Helper to get cached data
  const getCachedData = useCallback(<D>(key: string): D | undefined => {
    if (!key) return undefined;
    return apiCache.get<D>(key) || undefined;
  }, []);

  // Helper to cache data
  const cacheData = useCallback(<D>(key: string, data: D, duration: number): void => {
    if (!key) return;
    apiCache.set<D>(key, data, duration);
  }, []);

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
      const isInitialLoad = !isRefreshing;
      
      if (isInitialLoad) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      
      setError(null);

      try {
        // Check cache first if cacheKey is provided
        if (cacheKey) {
          const cachedData = getCachedData<T>(cacheKey);
          if (cachedData) {
            setData(cachedData);
            if (isInitialLoad) {
              setIsLoading(false);
            } else {
              setIsRefreshing(false);
            }
            
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
          cacheData(cacheKey, result, cacheDuration);
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
        if (isInitialLoad) {
          setIsLoading(false);
        } else {
          setIsRefreshing(false);
        }
        
        if (onSettled) onSettled();
      }
    },
    [
      apiFunction,
      cacheKey,
      cacheDuration,
      executeFetchWithRetries,
      getCachedData,
      cacheData,
      onError,
      onSettled,
      onSuccess,
      retries,
      isRefreshing
    ]
  );

  // Function to clear the cache for this specific API
  const clearCache = useCallback(() => {
    if (cacheKey) {
      apiCache.clearByPrefix(cacheKey.split("_")[0]);
      toast({
        title: "Cache Cleared",
        description: "Data will be freshly loaded on next request",
      });
    }
  }, [cacheKey]);
  
  // Track mounted state to prevent state updates after unmount
  const isMountedRef = React.useRef(true);
  
  // Load on mount if requested
  useEffect(() => {
    isMountedRef.current = true;
    
    if (loadOnMount) {
      fetchData();
    }
    
    return () => {
      isMountedRef.current = false;
    };
  }, [loadOnMount, fetchData]);

  return {
    data,
    error,
    isLoading,
    isRefreshing,
    fetchData,
    clearCache,
  };
}

// Helper for building a custom cacheKey based on function arguments
export function buildApiCacheKey(baseKey: string, ...args: any[]): string {
  return `${baseKey}_${args.map(arg => JSON.stringify(arg)).join('_')}`;
}
