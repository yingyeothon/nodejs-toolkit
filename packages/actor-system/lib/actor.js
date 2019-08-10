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
const event_broker_1 = require("@yingyeothon/event-broker");
const controlKey = "_control_";
class Actor extends event_broker_1.EventBroker {
    constructor({ name, queue, lock, logger }) {
        super();
        this.name = name;
        this.queue = queue;
        this.lock = lock;
        this.logger = logger;
    }
    post(item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.queue.push(this.name, item);
            this.logger.debug(`actor`, `push`, item);
        });
    }
    tryToProcess({ shiftTimeout } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const startMillis = Date.now();
            const isAlive = () => shiftTimeout > 0 ? Date.now() - startMillis < shiftTimeout : true;
            yield this.consumeLoop(isAlive);
        });
    }
    send(item, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.post(item);
            yield this.tryToProcess(options);
        });
    }
    consumeLoop(isAlive) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, queue, lock } = this;
            this.logger.debug(`actor`, `consume-loop`, name);
            while (true) {
                this.logger.debug(`actor`, `try-to-lock`, name);
                if (!(yield lock.tryAcquire(name))) {
                    this.logger.debug(`actor`, `cannot-lock`, name);
                    break;
                }
                yield this.consumeQueueInLock(isAlive);
                this.logger.debug(`actor`, `release-lock`, name);
                yield lock.release(name);
                if ((yield queue.size(name)) === 0) {
                    this.logger.debug(`actor`, `empty-queue`, name);
                    break;
                }
                if (!isAlive()) {
                    this.logger.debug(`actor`, `shift-timeout`, name);
                    yield maybeAwait(this.fire("shift", { name }));
                    break;
                }
            }
        });
    }
    consumeQueueInLock(isAlive) {
        return __awaiter(this, void 0, void 0, function* () {
            const { queue, name } = this;
            this.logger.debug(`actor`, `consume-queue`, name);
            while (isAlive() && (yield queue.size(name)) > 0) {
                const message = yield queue.peek(name);
                this.logger.debug(`actor`, `get-message`, name, message);
                if (!message) {
                    this.logger.debug(`actor`, `invalid-message`, name, message);
                    break;
                }
                yield this.processMessage(message);
                yield queue.pop(name);
                this.logger.debug(`actor`, `delete-message`, name);
            }
        });
    }
    processMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug(`actor`, `process-message`, this.name, message);
            try {
                if (message[controlKey]) {
                    yield this.processControlMessage(message);
                }
                else {
                    yield this.processUserMessage(message);
                }
            }
            catch (error) {
                this.logger.error(`actor`, `process-message-error`, this.name, message, error);
                yield maybeAwait(this.fire("error", error));
            }
        });
    }
    processControlMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = this;
            this.logger.debug(`actor`, `process-control-message`, name, message);
            switch (message[controlKey]) {
                case "spawn":
                    yield maybeAwait(this.fire("spawn", { name }));
                    break;
                case "despawn":
                    yield maybeAwait(this.fire("despawn", { name }));
                    break;
            }
        });
    }
    processUserMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = this;
            this.logger.debug(`actor`, `process-user-message`, name, message);
            yield maybeAwait(this.fire("act", { name, message }));
        });
    }
}
exports.Actor = Actor;
const maybeAwait = (maybePromise) => __awaiter(this, void 0, void 0, function* () {
    if (maybePromise && maybePromise instanceof Promise) {
        yield maybePromise;
    }
});
//# sourceMappingURL=actor.js.map