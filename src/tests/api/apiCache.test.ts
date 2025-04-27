
import { describe, it, expect, beforeEach } from 'vitest';
import ApiCache from '@/services/api/cacheService';

describe('ApiCache', () => {
  let cache: typeof ApiCache;
  const TTL = 1000; // 1 second

  beforeEach(() => {
    cache = ApiCache;
    cache.clear(); // Reset cache between tests
  });

  it('should store and retrieve items', () => {
    cache.set('key1', 'value1', TTL);
    expect(cache.get('key1')).toBe('value1');
  });

  it('should handle expired items', async () => {
    cache.set('key2', 'value2', 1); // 1ms TTL
    await new Promise(resolve => setTimeout(resolve, 2));
    expect(cache.get('key2')).toBeUndefined();
  });

  it('should respect max size limit', () => {
    for (let i = 0; i < 150; i++) {
      cache.set(`key${i}`, `value${i}`, TTL);
    }
    expect(cache.size()).toBeLessThanOrEqual(100);
  });

  it('should check if items exist', () => {
    cache.set('key3', 'value3', TTL);
    expect(cache.has('key3')).toBe(true);
    expect(cache.has('nonexistent')).toBe(false);
  });

  it('should delete items', () => {
    cache.set('key4', 'value4', TTL);
    cache.delete('key4');
    expect(cache.get('key4')).toBeUndefined();
  });

  it('should clear all items', () => {
    cache.set('key5', 'value5', TTL);
    cache.set('key6', 'value6', TTL);
    cache.clear();
    expect(cache.size()).toBe(0);
  });
});
