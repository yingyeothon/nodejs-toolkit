"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filtered_1 = require("@yingyeothon/logger/lib/filtered");
const writer_1 = require("./writer");
function S3Logger(env) {
    var _a;
    const s3Writer = writer_1.default(env);
    return {
        logger: new filtered_1.default((_a = env.severity, (_a !== null && _a !== void 0 ? _a : "info")), s3Writer),
        flush: s3Writer.flush
    };
}
exports.default = S3Logger;
//# sourceMappingURL=logger.js.map