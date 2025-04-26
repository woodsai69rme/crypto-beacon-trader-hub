
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEnhancedApi } from '@/hooks/use-enhanced-api';
import { toast } from '@/components/ui/use-toast';
import React from 'react';

jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn()
}));

describe('useEnhancedApi', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('should return data when API call is successful', async () => {
    const mockData = { test: 'success' };
    const mockFn = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useEnhancedApi(mockFn), { wrapper });
    
    const fetchedData = await result.current.fetchData();
    
    expect(fetchedData).toEqual(mockData);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors and show toast notification', async () => {
    const error = new Error('API Error');
    const mockFn = jest.fn().mockRejectedValue(error);

    const { result } = renderHook(() => useEnhancedApi(mockFn), { wrapper });
    
    await expect(result.current.fetchData()).resolves.toBeUndefined();
    expect(result.current.error).toEqual(error);
    expect(toast).toHaveBeenCalledWith({
      title: 'API Error',
      description: error.message,
      variant: 'destructive'
    });
  });

  it('should use cache when available', async () => {
    const mockData = { test: 'cached' };
    const mockFn = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useEnhancedApi(mockFn, { cacheKey: 'test-cache' }),
      { wrapper }
    );
    
    await result.current.fetchData();
    const firstCallCount = mockFn.mock.calls.length;
    
    const cachedData = await result.current.fetchData();
    expect(mockFn.mock.calls.length).toBe(firstCallCount);
    expect(cachedData).toEqual(mockData);
    expect(result.current.data).toEqual(mockData);
  });
});
