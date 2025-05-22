import { apiCache } from '@/services/api/apiCache';

describe('API Cache', () => {
  beforeEach(() => {
    apiCache.clear();
  });
  
  it('should store and retrieve values', () => {
    const testData = { test: 'data' };
    apiCache.set('test-key', testData);
    
    expect(apiCache.get('test-key')).toEqual(testData);
  });
  
  it('should check if keys exist', () => {
    apiCache.set('existing-key', 'value');
    
    expect(apiCache.has('existing-key')).toBe(true);
    expect(apiCache.has('non-existing-key')).toBe(false);
  });

  it('should remove keys', () => {
    apiCache.set('to-remove', 'value');
    apiCache.remove('to-remove');
    
    expect(apiCache.has('to-remove')).toBe(false);
  });

  it('should clear all entries', () => {
    apiCache.set('key1', 'value1');
    apiCache.set('key2', 'value2');
    apiCache.clear();
    
    expect(apiCache.size()).toBe(0);
  });
  
  // Add more tests as needed
});
