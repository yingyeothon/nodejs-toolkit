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
const actor_system_1 = require("@yingyeothon/actor-system");
const defaultAPIProxyFunctionTimeoutMillis = 6 * 1000;
exports.handleActorAPIEvent = ({ spawn, parseMessage: maybeParseMessage, functionTimeout, logger: maybeLogger }) => (event) => __awaiter(this, void 0, void 0, function* () {
    const parseMessage = maybeParseMessage || ((body) => JSON.parse(body));
    const logger = maybeLogger || new actor_system_1.ConsoleLogger();
    logger.debug(`actor-api-handler`, `handle`, event.path, event.body);
    const actor = spawn(event.path, event);
    if (!actor) {
        logger.error(`actor-api-handler`, `no-actor`, event);
        throw new Error(`No actor for [${event.path}]`);
    }
    const message = parseMessage(event.body);
    if (!message) {
        logger.error(`actor-api-handler`, `invalid-message`, actor.name, event.path, event.body);
        throw new Error(`Invalid message for actor[${actor.name}]`);
    }
    logger.debug(`actor-api-handler`, `post-and-process`, actor.name, message);
    yield actor.post(message);
    yield actor.tryToProcess({
        shiftTimeout: functionTimeout !== undefined
            ? functionTimeout
            : defaultAPIProxyFunctionTimeoutMillis
    });
    logger.debug(`actor-api-handler`, `end-of-handle`, actor.name);
    return { statusCode: 200, body: "OK" };
});
//# sourceMappingURL=api.js.map