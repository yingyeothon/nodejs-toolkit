import { IQueue } from "@yingyeothon/actor-system";
import { ICodec, JsonCodec } from "@yingyeothon/codec";
import { ConsoleLogger, ILogger } from "@yingyeothon/logger";
import * as IORedis from "ioredis";

interface IRedisQueueArguments {
  redis?: IORedis.Redis;
  keyPrefix?: string;
  codec?: ICodec<string>;
  logger?: ILogger;
}

export class RedisQueue implements IQueue {
  private readonly redis: IORedis.Redis;
  private readonly keyPrefix: string;
  private readonly codec: ICodec<string>;
  private readonly logger: ILogger;

  constructor({ redis, keyPrefix, codec, logger }: IRedisQueueArguments = {}) {
    this.redis = redis || new IORedis();
    this.keyPrefix = keyPrefix || "queue:";
    this.codec = codec || new JsonCodec();
    this.logger = logger || new ConsoleLogger();
  }

  public async size(actorName: string) {
    const redisKey = this.asRedisKey(actorName);
    const length = await this.redis.llen(redisKey);
    this.logger.debug(`redis-queue`, `size`, redisKey, length);
    return length;
  }

  public async push<T>(actorName: string, item: T) {
    const redisKey = this.asRedisKey(actorName);
    const pushed = await this.redis.rpush(redisKey, this.codec.encode(item));
    this.logger.debug(`redis-queue`, `push`, redisKey, item, pushed);
  }

  public async pop<T>(actorName: string) {
    const redisKey = this.asRedisKey(actorName);
    const value = await this.redis.lpop(redisKey);
    const decoded = this.codec.decode<T>(value);
    this.logger.debug(`redis-queue`, `pop`, redisKey, decoded);
    return decoded;
  }

  public async peek<T>(actorName: string) {
    const redisKey = this.asRedisKey(actorName);
    const value = await this.redis.lindex(redisKey, 0);
    const decoded = this.codec.decode<T>(value);
    this.logger.debug(`redis-queue`, `peek`, redisKey, decoded);
    return decoded;
  }

  private asRedisKey = (name: string) => this.keyPrefix + name;
}
