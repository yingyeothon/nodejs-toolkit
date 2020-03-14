"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialize_error_1 = require("serialize-error");
function serialize(timestamp, level, args) {
    return (JSON.stringify({
        level,
        timestamp: timestamp.toISOString(),
        args: args.map(arg => {
            if (arg instanceof Error) {
                return serialize_error_1.serializeError(arg);
            }
            return arg;
        })
    }) + "\n");
}
exports.default = serialize;
//# sourceMappingURL=serialize.js.map