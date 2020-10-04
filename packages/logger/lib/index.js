"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleWriter = exports.ConsoleLogger = exports.nullLogger = exports.combine = exports.FilteredLogger = void 0;
var filtered_1 = require("./filtered");
Object.defineProperty(exports, "FilteredLogger", { enumerable: true, get: function () { return filtered_1.default; } });
var combine_1 = require("./combine");
Object.defineProperty(exports, "combine", { enumerable: true, get: function () { return combine_1.default; } });
var null_1 = require("./null");
Object.defineProperty(exports, "nullLogger", { enumerable: true, get: function () { return null_1.default; } });
var console_1 = require("./console");
Object.defineProperty(exports, "ConsoleLogger", { enumerable: true, get: function () { return console_1.default; } });
var writer_1 = require("./console/writer");
Object.defineProperty(exports, "consoleWriter", { enumerable: true, get: function () { return writer_1.default; } });
//# sourceMappingURL=index.js.map