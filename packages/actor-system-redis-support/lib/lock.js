"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@yingyeothon/logger");
const IORedis = require("ioredis");
class RedisLock {
    constructor({ redis, keyPrefix, logger } = {}) {
        this.asRedisKey = (name) => this.keyPrefix + name;
        this.redis = redis || new IORedis();
        this.keyPrefix = keyPrefix || "lock:";
        this.logger = logger || new logger_1.ConsoleLogger();
    }
    tryAcquire(actorName) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = this.asRedisKey(actorName);
            const oldValue = yield this.redis.getset(redisKey, RedisLock.Locked);
            this.logger.debug(`redis-lock`, `try-acquire`, redisKey, `old`, oldValue);
            return oldValue === null || oldValue === RedisLock.Unlocked;
        });
    }
    release(actorName) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = this.asRedisKey(actorName);
            yield this.redis.del(redisKey);
            this.logger.debug(`redis-lock`, `release`, redisKey);
            return true;
        });
    }
}
RedisLock.Locked = "1";
RedisLock.Unlocked = "0";
exports.RedisLock = RedisLock;
//# sourceMappingURL=lock.js.map