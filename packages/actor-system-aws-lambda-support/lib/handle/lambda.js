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
const aws_sdk_1 = require("aws-sdk");
const defaultLambdaFunctionTimeoutMillis = 14 * 60 * 1000;
exports.handleActorLambdaEvent = ({ spawn, functionTimeout, logger: maybeLogger }) => (event) => __awaiter(this, void 0, void 0, function* () {
    const logger = maybeLogger || new logger_1.ConsoleLogger();
    logger.debug(`actor-lambda`, `handle`, event.actorName);
    const actor = spawn(event.actorName);
    if (!actor) {
        throw new Error(`No actor [${event.actorName}]`);
    }
    yield actor.tryToProcess({
        shiftTimeout: functionTimeout !== undefined
            ? functionTimeout
            : defaultLambdaFunctionTimeoutMillis
    });
    logger.debug(`actor-lambda`, `end-of-handle`, event.actorName);
});
exports.shiftToNextLambda = ({ functionName, functionVersion }) => ({ name: actorName }) => new aws_sdk_1.Lambda()
    .invoke({
    FunctionName: functionName,
    InvocationType: "Event",
    Qualifier: functionVersion || "$LATEST",
    Payload: JSON.stringify({
        actorName
    })
})
    .promise();
//# sourceMappingURL=lambda.js.map