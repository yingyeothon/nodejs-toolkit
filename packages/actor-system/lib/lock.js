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
class InMemoryLock {
    constructor() {
        this.lockHolders = new Set();
    }
    tryAcquire(actorName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.lockHolders.has(actorName)) {
                return false;
            }
            this.lockHolders.add(actorName);
            return true;
        });
    }
    release(actorName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.lockHolders.delete(actorName);
        });
    }
}
exports.InMemoryLock = InMemoryLock;
//# sourceMappingURL=lock.js.map