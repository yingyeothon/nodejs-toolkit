"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const combine_1 = require("@yingyeothon/logger/lib/combine");
const writer_1 = require("@yingyeothon/logger/lib/console/writer");
const filtered_1 = require("@yingyeothon/logger/lib/filtered");
const null_1 = require("@yingyeothon/logger/lib/null");
const writer_2 = require("./writer");
function S3Logger(env) {
    var _a;
    const s3Writer = writer_2.default(env);
    const writer = combine_1.default(s3Writer, env.withConsole ? writer_1.default : null_1.default);
    return {
        logger: new filtered_1.default((_a = env.severity, (_a !== null && _a !== void 0 ? _a : "info")), writer),
        flush: s3Writer.flush
    };
}
exports.default = S3Logger;
//# sourceMappingURL=logger.js.map