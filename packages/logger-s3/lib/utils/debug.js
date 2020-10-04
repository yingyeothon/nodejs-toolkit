"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugPrint = void 0;
function debugPrint(...args) {
    if (process.env.DEBUG) {
        console.debug(...args);
    }
}
exports.debugPrint = debugPrint;
//# sourceMappingURL=debug.js.map