interface CacheItem<T> {
  data: T;
  expiresAt: number;
}

export class TTLCache {
  private static cache = new Map<string, CacheItem<any>>();

  public static set<T>(key: string, data: T, ttlSeconds: number = 60): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { data, expiresAt });
  }

  public static get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  public static clear(): void {
    this.cache.clear();
  }
}
