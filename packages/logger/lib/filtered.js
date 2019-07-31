"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filteredLogger = (severity, callback) => {
    const thisLevel = asLevel(severity);
    return (configuredSeverity, ...args) => {
        const configuredLevel = asLevel(configuredSeverity);
        if (thisLevel >= configuredLevel) {
            callback(...args);
        }
    };
};
const asLevel = (severity) => {
    switch (severity) {
        case "debug":
            return 100;
        case "info":
            return 500;
        case "error":
            return 900;
    }
    return 0;
};
class FilteredLogger {
    constructor(severity, writer) {
        this.severity = severity;
        this.writer = writer;
        this.debug = (...args) => filteredLogger("debug", this.writer.debug)(this.severity, ...args);
        this.info = (...args) => filteredLogger("info", this.writer.info)(this.severity, ...args);
        this.error = (...args) => filteredLogger("error", this.writer.error)(this.severity, ...args);
    }
}
exports.FilteredLogger = FilteredLogger;
//# sourceMappingURL=filtered.js.map