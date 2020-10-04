"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonCodec = void 0;
class JsonCodec {
    encode(item) {
        if (item === undefined) {
            return JsonCodec.Undefined;
        }
        return JSON.stringify(item);
    }
    decode(value) {
        if (value === undefined) {
            throw new Error(`Value cannot be undefined`);
        }
        return JSON.parse(value);
    }
}
exports.JsonCodec = JsonCodec;
JsonCodec.Undefined = "undefined";
//# sourceMappingURL=codec.js.map