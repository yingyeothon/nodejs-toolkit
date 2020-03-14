"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function debugPrint(...args) {
    if (process.env.DEBUG) {
        console.debug(...args);
    }
}
exports.debugPrint = debugPrint;
//# sourceMappingURL=debug.js.map