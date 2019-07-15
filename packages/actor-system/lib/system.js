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
const actor_1 = require("./actor");
const logger_1 = require("./logger");
class ActorSystem {
    constructor({ queue, lock, logger }) {
        this.actors = {};
        this.queue = queue;
        this.lock = lock;
        this.logger = logger || new logger_1.ConsoleLogger();
    }
    spawn(actorName) {
        const spawned = this.find(actorName);
        if (spawned) {
            this.logger.debug(`actor-system`, `already-spawned`, actorName);
            return spawned;
        }
        this.logger.debug(`actor-system`, `spawn-new-actor`, actorName);
        const actor = new actor_1.Actor({
            name: actorName,
            queue: this.queue,
            lock: this.lock,
            logger: this.logger
        });
        this.logger.debug(`actor-system`, `post-spawn-msg`, actorName);
        actor.post({
            _control_: "spawn"
        });
        this.logger.debug(`actor-system`, `register-to-actor-map`, actorName);
        this.actors[actorName] = actor;
        return actor;
    }
    despawn(actorName, processOption = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const actor = this.find(actorName);
            if (!actor) {
                this.logger.error(`actor-system`, `no-actor-to-despawn`, actorName);
                return false;
            }
            this.logger.debug(`actor-system`, `post-despawn-msg`, actorName);
            yield actor.post({
                _control_: "despawn"
            });
            yield actor.tryToProcess(processOption);
            this.logger.debug(`actor-system`, `delete-from-actor-map`, actorName);
            delete this.actors[actorName];
            return true;
        });
    }
    find(actorName) {
        const actor = this.actors[actorName];
        if (!actor) {
            return null;
        }
        return actor;
    }
}
exports.ActorSystem = ActorSystem;
//# sourceMappingURL=system.js.map