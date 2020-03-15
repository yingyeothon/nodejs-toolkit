"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("./utils/debug");
function buffered({ asKey, autoFlushIntervalMillis = 10 * 1000, autoFlushMaxBufferSize = 1024, onAutoFlush, withConsole = false }) {
    let lastFlushed = Date.now();
    let buffer = [];
    function isAutoFlushable() {
        return (Date.now() - lastFlushed > autoFlushIntervalMillis ||
            buffer.length > autoFlushMaxBufferSize);
    }
    function write(severity) {
        return (...args) => {
            const now = new Date();
            buffer.push({
                key: asKey(now, severity),
                timestamp: now,
                severity,
                args
            });
            if (typeof withConsole === "boolean") {
                if (withConsole) {
                    console[severity](now.toISOString(), severity, ...args);
                }
            }
            else {
                withConsole({ timestamp: now, severity, args });
            }
            if (isAutoFlushable()) {
                const timestamp = Date.now();
                debug_1.debugPrint("BUFFERED", "Try to auto flush", timestamp);
                const flushed = flush();
                if (flushed.length > 0) {
                    debug_1.debugPrint("BUFFERED", "Do auto flush", timestamp);
                    onAutoFlush(flushed, timestamp);
                }
                else {
                    debug_1.debugPrint("BUFFERED", "Nothing to auto flush", timestamp);
                }
            }
        };
    }
    function flush() {
        const logs = buffer;
        buffer = [];
        lastFlushed = Date.now();
        return logs;
    }
    return { write, flush };
}
exports.default = buffered;
//# sourceMappingURL=buffered.js.map