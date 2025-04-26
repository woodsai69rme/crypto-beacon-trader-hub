
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useEnhancedApi, buildApiCacheKey } from '@/hooks/use-enhanced-api';
import { toast } from '@/components/ui/use-toast';

// Mock toast
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

// Mock apiCache
jest.mock('@/services/api/cacheService', () => {
  const cache = new Map();
  return {
    default: {
      get: jest.fn((key) => cache.get(key)),
      set: jest.fn((key, value, duration) => cache.set(key, value)),
      clear: jest.fn(() => cache.clear()),
      clearByPrefix: jest.fn(),
    },
  };
});

describe('useEnhancedApi', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('returns data when API call is successful', async () => {
    const mockApiFunction = jest.fn().mockResolvedValue({ test: 'data' });
    
    const { result } = renderHook(() => useEnhancedApi(mockApiFunction), {
      wrapper,
    });

    act(() => {
      result.current.fetchData();
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.data).toEqual({ test: 'data' });
    expect(result.current.error).toBeNull();
  });

  it('handles error when API call fails', async () => {
    const error = new Error('API Error');
    const mockApiFunction = jest.fn().mockRejectedValue(error);
    
    const { result } = renderHook(() => useEnhancedApi(mockApiFunction), {
      wrapper,
    });

    act(() => {
      result.current.fetchData();
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual(error);
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'API Error',
      variant: 'destructive',
    }));
  });
});

describe('buildApiCacheKey', () => {
  it('should build a proper cache key', () => {
    const key = buildApiCacheKey('test', 1, { foo: 'bar' });
    expect(key).toBe('test_1_{"foo":"bar"}');
  });
});
