"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConsoleLogger {
    constructor(severity = "info") {
        this.severity = severity;
        this.debug = (...args) => this.severity === "debug" ? console.debug(...args) : undefined;
        this.info = (...args) => this.severity === "debug" || this.severity === "info"
            ? console.info(...args)
            : undefined;
        this.error = (...args) => console.error(...args);
    }
}
exports.ConsoleLogger = ConsoleLogger;
//# sourceMappingURL=logger.js.map