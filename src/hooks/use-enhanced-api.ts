
import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { getCachedData, cacheData, buildApiCacheKey } from '@/utils/apiCacheUtils';
import { executeWithRetries } from '@/utils/apiRetryUtils';

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
        const result = await executeWithRetries(fetchFn, retries, retryDelay, retryIf);

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
      retries,
      retryDelay,
      retryIf,
      onSuccess,
      onError,
      onSettled,
      isRefreshing
    ]
  );

  // Function to clear the cache for this specific API
  const clearCache = useCallback(() => {
    if (cacheKey) {
      const baseKey = cacheKey.split("_")[0];
      apiCache.clearByPrefix(baseKey);
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

// Re-export buildApiCacheKey for convenience
export { buildApiCacheKey };
