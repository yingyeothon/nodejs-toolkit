import { ILock } from "@yingyeothon/actor-system";
import { ConsoleLogger, ILogger } from "@yingyeothon/logger";
import * as IORedis from "ioredis";

interface IRedisLockArguments {
  redis?: IORedis.Redis;
  keyPrefix?: string;
  logger?: ILogger;
}

export class RedisLock implements ILock {
  private static readonly Locked = "1";
  private static readonly Unlocked = "0";

  private readonly redis: IORedis.Redis;
  private readonly keyPrefix: string;
  private readonly logger: ILogger;

  constructor({ redis, keyPrefix, logger }: IRedisLockArguments = {}) {
    this.redis = redis || new IORedis();
    this.keyPrefix = keyPrefix || "lock:";
    this.logger = logger || new ConsoleLogger();
  }

  public async tryAcquire(actorName: string) {
    const redisKey = this.asRedisKey(actorName);
    const oldValue = await this.redis.getset(redisKey, RedisLock.Locked);
    this.logger.debug(`redis-lock`, `try-acquire`, redisKey, `old`, oldValue);
    return oldValue === null || oldValue === RedisLock.Unlocked;
  }

  public async release(actorName: string) {
    const redisKey = this.asRedisKey(actorName);
    await this.redis.del(redisKey);
    this.logger.debug(`redis-lock`, `release`, redisKey);
    return true;
  }

  private asRedisKey = (name: string) => this.keyPrefix + name;
}
