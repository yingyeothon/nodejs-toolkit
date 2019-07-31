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
const codec_1 = require("@yingyeothon/codec");
const logger_1 = require("@yingyeothon/logger");
const IORedis = require("ioredis");
class RedisQueue {
    constructor({ redis, keyPrefix, codec, logger } = {}) {
        this.asRedisKey = (name) => this.keyPrefix + name;
        this.redis = redis || new IORedis();
        this.keyPrefix = keyPrefix || "queue:";
        this.codec = codec || new codec_1.JsonCodec();
        this.logger = logger || new logger_1.ConsoleLogger();
    }
    size(actorName) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = this.asRedisKey(actorName);
            const length = yield this.redis.llen(redisKey);
            this.logger.debug(`redis-queue`, `size`, redisKey, length);
            return length;
        });
    }
    push(actorName, item) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = this.asRedisKey(actorName);
            const pushed = yield this.redis.rpush(redisKey, this.codec.encode(item));
            this.logger.debug(`redis-queue`, `push`, redisKey, item, pushed);
        });
    }
    pop(actorName) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = this.asRedisKey(actorName);
            const value = yield this.redis.lpop(redisKey);
            const decoded = this.codec.decode(value);
            this.logger.debug(`redis-queue`, `pop`, redisKey, decoded);
            return decoded;
        });
    }
    peek(actorName) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = this.asRedisKey(actorName);
            const value = yield this.redis.lindex(redisKey, 0);
            const decoded = this.codec.decode(value);
            this.logger.debug(`redis-queue`, `peek`, redisKey, decoded);
            return decoded;
        });
    }
}
exports.RedisQueue = RedisQueue;
//# sourceMappingURL=queue.js.map