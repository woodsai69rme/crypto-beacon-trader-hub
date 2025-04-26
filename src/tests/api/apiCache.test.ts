
import apiCache from '@/services/api/cacheService';

describe('ApiCache', () => {
  beforeEach(() => {
    apiCache.clear();
  });

  it('should store and retrieve data', () => {
    apiCache.set('testKey', { data: 'testValue' });
    expect(apiCache.get('testKey')).toEqual({ data: 'testValue' });
  });

  it('should return null for non-existent keys', () => {
    expect(apiCache.get('nonExistentKey')).toBeNull();
  });

  it('should expire items correctly', async () => {
    // Mock Date.now to control time
    const originalNow = Date.now;
    const mockNow = jest.fn();
    
    // Set initial time
    mockNow.mockReturnValue(1000);
    global.Date.now = mockNow;

    // Set cache with 100ms expiry
    apiCache.set('shortLivedKey', 'value', 100);
    expect(apiCache.get('shortLivedKey')).toBe('value');
    
    // Advance time past expiry
    mockNow.mockReturnValue(1200);
    expect(apiCache.get('shortLivedKey')).toBeNull();
    
    // Restore original Date.now
    global.Date.now = originalNow;
  });

  it('should clear cache by prefix', () => {
    apiCache.set('test1_data', 'value1');
    apiCache.set('test1_config', 'value2');
    apiCache.set('test2_data', 'value3');
    
    apiCache.clearByPrefix('test1');
    
    expect(apiCache.get('test1_data')).toBeNull();
    expect(apiCache.get('test1_config')).toBeNull();
    expect(apiCache.get('test2_data')).toBe('value3');
  });

  it('should clear all cache items', () => {
    apiCache.set('key1', 'value1');
    apiCache.set('key2', 'value2');
    
    apiCache.clear();
    
    expect(apiCache.get('key1')).toBeNull();
    expect(apiCache.get('key2')).toBeNull();
  });
});
