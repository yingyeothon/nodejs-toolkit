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
class InMemoryQueue {
    constructor() {
        this.queues = {};
    }
    size(actorName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.queues[actorName] ? this.queues[actorName].length : 0;
        });
    }
    push(actorName, item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.queues[actorName]) {
                this.queues[actorName] = [];
            }
            this.queues[actorName].push(item);
        });
    }
    pop(actorName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.queues[actorName] || this.queues[actorName].length === 0) {
                return null;
            }
            return this.queues[actorName].shift();
        });
    }
    peek(actorName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.queues[actorName] || this.queues[actorName].length === 0) {
                return null;
            }
            return this.queues[actorName][0];
        });
    }
}
exports.InMemoryQueue = InMemoryQueue;
//# sourceMappingURL=queue.js.map