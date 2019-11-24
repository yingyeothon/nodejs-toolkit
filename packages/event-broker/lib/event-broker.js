"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class EventBroker {
    constructor() {
        this.handlers = {};
        this.on = (name, handler) => {
            if (!this.handlers[name]) {
                this.handlers[name] = [];
            }
            this.handlers[name].push(handler);
            return this;
        };
        this.fire = (name, event) => __awaiter(this, void 0, void 0, function* () {
            if (!this.handlers[name]) {
                return false;
            }
            for (const handler of this.handlers[name]) {
                const result = handler(event);
                if (result instanceof Promise) {
                    yield result;
                }
            }
            return true;
        });
    }
}
exports.EventBroker = EventBroker;
//# sourceMappingURL=event-broker.js.map