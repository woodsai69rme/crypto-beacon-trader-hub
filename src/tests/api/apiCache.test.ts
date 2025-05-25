
import { apiCache } from '@/services/api/apiCache';

describe('ApiCache', () => {
  beforeEach(() => {
    apiCache.clear();
  });

  it('should set and get cache entries', () => {
    const testData = { test: 'data' };
    apiCache.set('test-key', testData, 5000);
    
    const result = apiCache.get('test-key');
    expect(result).toEqual(testData);
  });

  it('should return null for expired entries', () => {
    const testData = { test: 'data' };
    apiCache.set('test-key', testData, -1000); // Already expired
    
    const result = apiCache.get('test-key');
    expect(result).toBeNull();
  });

  it('should check if cache has key', () => {
    apiCache.set('test-key', { test: 'data' }, 5000);
    
    expect(apiCache.has('test-key')).toBe(true);
    expect(apiCache.has('non-existent')).toBe(false);
  });
});
