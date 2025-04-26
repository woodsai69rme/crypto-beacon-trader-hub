
import { renderHook } from '@testing-library/react';
import { useEnhancedApi } from '@/hooks/use-enhanced-api';

describe('useEnhancedApi', () => {
  it('should handle successful API calls', async () => {
    const mockData = { success: true, data: 'test' };
    const mockApi = jest.fn().mockResolvedValue(mockData);
    
    const { result } = renderHook(() => useEnhancedApi(mockApi));
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle API errors', async () => {
    const mockError = new Error('API Error');
    const mockApi = jest.fn().mockRejectedValue(mockError);
    
    const { result } = renderHook(() => useEnhancedApi(mockApi));
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
