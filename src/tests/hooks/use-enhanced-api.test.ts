
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEnhancedApi, buildApiCacheKey } from '@/hooks/use-enhanced-api';
import { toast } from '@/components/ui/use-toast';

jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn()
}));

describe('useEnhancedApi', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('should return data when API call is successful', async () => {
    const mockData = { test: 'success' };
    const mockFn = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useEnhancedApi(mockFn), { wrapper });
    
    await result.current.fetchData();
    
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors and show toast notification', async () => {
    const error = new Error('API Error');
    const mockFn = jest.fn().mockRejectedValue(error);

    const { result } = renderHook(() => useEnhancedApi(mockFn), { wrapper });
    
    await result.current.fetchData();
    
    expect(result.current.error).toEqual(error);
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'API Error',
        variant: 'destructive'
      })
    );
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
    
    // Second call should use cache
    await result.current.fetchData();
    
    expect(mockFn.mock.calls.length).toBe(firstCallCount);
    expect(result.current.data).toEqual(mockData);
  });
  
  it('should build proper cache keys', () => {
    const key1 = buildApiCacheKey('coins', 'bitcoin');
    const key2 = buildApiCacheKey('coins', { id: 'bitcoin', days: 7 });
    
    expect(key1).toBe('coins_"bitcoin"');
    expect(key2).toBe('coins_{"id":"bitcoin","days":7}');
  });
});
