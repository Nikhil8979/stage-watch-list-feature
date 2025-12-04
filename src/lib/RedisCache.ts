import Redis from "ioredis";
import {
  REDIS_HOST,
  REDIS_MAX_RETRIES_PER_REQUEST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_USERNAME,
} from "../config";

export class RedisCache {
  private static instance: RedisCache;
  private readonly client!: Redis;
  constructor() {
    try {
      this.client = new Redis({
        port: Number(REDIS_PORT),
        host: REDIS_HOST,
        password: REDIS_PASSWORD,
        username: REDIS_USERNAME,
        maxRetriesPerRequest: Number(REDIS_MAX_RETRIES_PER_REQUEST),
      });
    } catch (err) {
      console.log(err, "---- redis error -----");
    }
  }
  public static getInstance() {
    if (!this.instance) {
      this.instance = new RedisCache();
    }
    return this.instance;
  }
  getClient() {
    return this.client;
  }
  async set(
    key: string,
    value: any,
    expiredTimeSeconds?: number
  ): Promise<void> {
    if (expiredTimeSeconds) {
      await this.client.set(key, value, "EX", expiredTimeSeconds);
    } else {
      await this.client.set(key, value);
    }
  }
  async get(key: string): Promise<any> {
    return await this.client.get(key);
  }
  async incr(key: string): Promise<number> {
    return await this.client.incr(key);
  }
  async evict(key: string): Promise<void> {
    await this.client.del(key);
  }
}
