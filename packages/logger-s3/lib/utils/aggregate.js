"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function aggregate(buffer) {
    const bag = {};
    for (const { key, body } of buffer) {
        if (key in bag) {
            bag[key] += body;
        }
        else {
            bag[key] = body;
        }
    }
    return bag;
}
exports.default = aggregate;
//# sourceMappingURL=aggregate.js.map