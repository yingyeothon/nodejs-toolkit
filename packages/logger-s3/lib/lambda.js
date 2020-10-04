"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const serialize_error_1 = require("serialize-error");
const yyyyMMdd_1 = require("./utils/yyyyMMdd");
function LambdaS3Logger(env) {
    const { systemName, handlerName, lambdaId } = env;
    function serialize(timestamp, level, args) {
        return (JSON.stringify({
            timestamp: timestamp.toISOString(),
            level,
            systemName,
            systemId: env.systemId,
            handlerName,
            lambdaId,
            args: args.map((arg) => arg instanceof Error ? serialize_error_1.serializeError(arg) : arg),
        }) + "\n");
    }
    function writeConsole({ timestamp, severity, args }) {
        console[severity](timestamp.toISOString(), severity.toUpperCase(), ...[systemName, env.systemId, handlerName, lambdaId].map((v) => v === undefined ? "null" : v), ...args);
    }
    function updateSystemId(systemId) {
        env.systemId = systemId;
    }
    if (!env.asKey && !env.logKeyPrefix && !env.systemName) {
        throw new Error("Please set one of `asKey`, `logKeyPrefix` and `systemName` at least");
    }
    const s3Logger = logger_1.default(Object.assign({ asKey: () => [env.logKeyPrefix, systemName, yyyyMMdd_1.default()].filter(Boolean).join("/"), serializer: serialize, withConsole: writeConsole }, env));
    return Object.assign(Object.assign({}, s3Logger), { updateSystemId });
}
exports.default = LambdaS3Logger;
//# sourceMappingURL=lambda.js.map