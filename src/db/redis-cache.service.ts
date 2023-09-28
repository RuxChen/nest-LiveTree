import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  cacheSet(key: string, value: any, ttl: number) {
    this.cacheManager.set(key, value, { ttl }, (err) => {
      if (err) throw err;
    });
  }

  async cacheGet(key: string): Promise<any> {
    return this.cacheManager.get(key);
  }
}
