"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const null_1 = require("./null");
function combine(...writers) {
    function severityWith(severity) {
        return function (...args) {
            writers
                .filter((writer) => writer !== null_1.default)
                .forEach((writer) => {
                writer[severity](...args);
            });
        };
    }
    const combined = {};
    for (const severity of ["debug", "info", "error"]) {
        combined[severity] = severityWith(severity);
    }
    return combined;
}
exports.default = combine;
//# sourceMappingURL=combine.js.map