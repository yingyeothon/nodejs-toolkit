"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonCodec {
    encode(item) {
        if (item === undefined) {
            return JsonCodec.Undefined;
        }
        return JSON.stringify(item);
    }
    decode(value) {
        if (value === undefined) {
            return undefined;
        }
        return JSON.parse(value);
    }
}
JsonCodec.Undefined = "undefined";
exports.JsonCodec = JsonCodec;
//# sourceMappingURL=codec.js.map