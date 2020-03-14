"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filtered_1 = require("../filtered");
const writer_1 = require("./writer");
class ConsoleLogger extends filtered_1.default {
    constructor(severity = "info") {
        super(severity, writer_1.default);
        this.severity = severity;
    }
}
exports.default = ConsoleLogger;
//# sourceMappingURL=index.js.map