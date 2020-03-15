"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function yyyyMMdd() {
    const now = new Date();
    return (now.getFullYear() + zeroPad(now.getMonth() + 1) + zeroPad(now.getDate()));
}
exports.default = yyyyMMdd;
function zeroPad(value) {
    return `0${value}`.slice(-2);
}
//# sourceMappingURL=yyyyMMdd.js.map