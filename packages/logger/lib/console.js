"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filtered_1 = require("./filtered");
class ConsoleLogger extends filtered_1.FilteredLogger {
    constructor(severity = "info") {
        super(severity, {
            debug: console.debug,
            info: console.info,
            error: console.error
        });
        this.severity = severity;
    }
}
exports.ConsoleLogger = ConsoleLogger;
//# sourceMappingURL=console.js.map