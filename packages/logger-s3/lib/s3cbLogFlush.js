"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3_cache_bridge_client_1 = require("@yingyeothon/s3-cache-bridge-client");
const aggregate_1 = require("./utils/aggregate");
const debug_1 = require("./utils/debug");
function s3cbLogFlush({ apiUrl = process.env.S3CB_URL, apiId = process.env.S3CB_ID, apiPassword = process.env.S3CB_PASSWORD }) {
    if (apiUrl === undefined) {
        throw new Error("No URL for S3CB");
    }
    const s3cb = s3_cache_bridge_client_1.default({
        apiUrl,
        apiId,
        apiPassword
    });
    let promise = Promise.resolve();
    function flush(logs, timestamp) {
        if (logs.length === 0) {
            debug_1.debugPrint("S3CB", "Nothing to flush", timestamp);
            return Promise.resolve();
        }
        const bag = aggregate_1.default(logs);
        return (promise = promise.then(() => __awaiter(this, void 0, void 0, function* () {
            debug_1.debugPrint("S3CB", "Do flush", timestamp, bag);
            yield Promise.all(Object.entries(bag).map(([key, body]) => s3cb.append(key, body)));
        })));
    }
    return flush;
}
exports.default = s3cbLogFlush;
//# sourceMappingURL=s3cbLogFlush.js.map