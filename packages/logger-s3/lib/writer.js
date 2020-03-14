"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buffered_1 = require("./buffered");
const s3cbLogFlush_1 = require("./s3cbLogFlush");
function S3LogWriter(env) {
    const s3cbFlush = s3cbLogFlush_1.default(env);
    const { write: bufferWrite, flush: bufferFlush } = buffered_1.default(Object.assign(Object.assign({}, env), { onAutoFlush: s3cbFlush }));
    return {
        debug: bufferWrite("debug"),
        info: bufferWrite("info"),
        error: bufferWrite("error"),
        flush: () => s3cbFlush(bufferFlush(), Date.now())
    };
}
exports.default = S3LogWriter;
//# sourceMappingURL=writer.js.map