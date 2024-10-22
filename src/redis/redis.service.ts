// import { Injectable } from '@nestjs/common';
// import {InjectRedis, RedisModule} from '@nestjs-modules/ioredis';
// import {Redis} from "ioredis";
//
// @Injectable()
// export class CacheService {
//     constructor(@InjectRedis() private readonly redis: Redis) {}
//
//     async set(key: string, value: any, ttl: number): Promise<void> {
//         await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
//     }
//
//     async get<T>(key: string): Promise<T | null> {
//         const value = await this.redis.get(key);
//         return value ? JSON.parse(value) : null;
//     }
//
//     async del(key: string): Promise<void> {
//         await this.redis.del(key);
//     }
// }
