"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Timeline {
    constructor() {
        this.epochMillis = Date.now();
    }
    reset() {
        this.epochMillis = Date.now();
    }
    get passedMillis() {
        return Date.now() - this.epochMillis;
    }
}
exports.Timeline = Timeline;
exports.globalTimeline = new Timeline();
//# sourceMappingURL=time.js.map