
import { useState, useCallback } from 'react';
import { handleError } from '@/utils/errorHandling';
import { getCachedData, cacheData } from '@/utils/apiCache';
import { executeWithRetries } from '@/utils/apiRetryUtils';

interface UseApiOptions<T> {
  initialData?: T;
  cacheKey?: string;
  cacheDuration?: number;
  retries?: number;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  retryIf?: (error: any) => boolean;
  errorContext?: string;
  useCustomErrorHandling?: boolean;
}

export function useEnhancedApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const {
    initialData,
    cacheKey,
    cacheDuration = 5 * 60 * 1000,
    retries = 1,
    retryDelay = 1000,
    onSuccess,
    onError,
    onSettled,
    retryIf = () => true,
    errorContext,
    useCustomErrorHandling = false
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = useCallback(
    async (...args: any[]): Promise<T | undefined> => {
      setIsLoading(true);
      setError(null);

      try {
        if (cacheKey) {
          const cachedData = getCachedData<T>(cacheKey);
          if (cachedData) {
            setData(cachedData);
            if (onSuccess) onSuccess(cachedData);
            return cachedData;
          }
        }

        const fetchFn = () => apiFunction(...args);
        const result = await executeWithRetries(
          fetchFn, 
          retries, 
          retryDelay, 
          retryIf,
          errorContext
        );

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
        
        // Use our enhanced error handling if not disabled
        if (!useCustomErrorHandling) {
          handleError(error, {
            context: errorContext || 'API Request',
            retry: retries > 0,
            retryFn: () => fetchData(...args)
          });
        }
        
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
      retries,
      retryDelay,
      retryIf,
      onSuccess,
      onError,
      onSettled,
      errorContext,
      useCustomErrorHandling
    ]
  );

  return {
    data,
    error,
    isLoading,
    fetchData,
    refetch: fetchData,
  };
}
