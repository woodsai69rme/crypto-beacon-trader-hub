import { ApiCache } from '@/services/api/apiCache';

describe('ApiCache', () => {
  let cache: ApiCache<string, number>;

  beforeEach(() => {
    cache = new ApiCache<string, number>(5);
  });

  it('should set and get values correctly', () => {
    cache.set('a', 1);
    expect(cache.get('a')).toBe(1);
  });

  it('should return undefined for non-existent keys', () => {
    expect(cache.get('b')).toBeUndefined();
  });

  it('should remove values correctly', () => {
    cache.set('a', 1);
    cache.remove('a');
    expect(cache.get('a')).toBeUndefined();
  });

  it('should clear the cache correctly', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.clear();
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBeUndefined();
  });

  it('should respect the maxSize limit', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.set('d', 4);
    cache.set('e', 5);
    cache.set('f', 6); // This should evict 'a'

    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('f')).toBe(6);
    expect(cache.size).toBe(5);
  });

  it('should update the lastUsed timestamp on get', () => {
    cache.set('a', 1);
    const first = (cache as any).cache.get('a')?.lastUsed;
    cache.get('a');
    const second = (cache as any).cache.get('a')?.lastUsed;
    expect(first).not.toBe(second);
  });

  it('should evict the least recently used item', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.get('a'); // 'a' is now the most recently used
    cache.set('d', 4);
    cache.set('e', 5);
    cache.set('f', 6); // This should evict 'b'

    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('a')).toBe(1);
  });

  it('should handle complex keys correctly', () => {
    const key1 = { id: 1, name: 'test' };
    const key2 = { id: 2, name: 'test2' };

    cache.set(JSON.stringify(key1), 100);
    cache.set(JSON.stringify(key2), 200);

    expect(cache.get(JSON.stringify(key1))).toBe(100);
    expect(cache.get(JSON.stringify(key2))).toBe(200);
  });

  it('should not throw an error when removing a non-existent key', () => {
    expect(() => cache.remove('non-existent')).not.toThrow();
  });

  it('should allow null and undefined values to be cached', () => {
    cache.set('nullValue', null);
    cache.set('undefinedValue', undefined);

    expect(cache.get('nullValue')).toBeNull();
    expect(cache.get('undefinedValue')).toBeUndefined();
  });

  it('should correctly report the size of the cache', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    expect(cache.size).toBe(2);
    cache.remove('a');
    expect(cache.size).toBe(1);
    cache.clear();
    expect(cache.size).toBe(0);
  });
});
