import { ILock } from "@yingyeothon/actor-system";
import { ILogger } from "@yingyeothon/logger";
import * as IORedis from "ioredis";
interface IRedisLockArguments {
    redis?: IORedis.Redis;
    keyPrefix?: string;
    logger?: ILogger;
}
export declare class RedisLock implements ILock {
    private static readonly Locked;
    private static readonly Unlocked;
    private readonly redis;
    private readonly keyPrefix;
    private readonly logger;
    constructor({ redis, keyPrefix, logger }?: IRedisLockArguments);
    tryAcquire(actorName: string): Promise<boolean>;
    release(actorName: string): Promise<boolean>;
    private asRedisKey;
}
export {};
