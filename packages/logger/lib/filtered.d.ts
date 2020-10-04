import LogSeverity from "./severity";
import LogWriter from "./writer";
import Logger from "./logger";
export default class FilteredLogger implements Logger {
    severity: LogSeverity;
    private readonly writer;
    constructor(severity: LogSeverity, writer: LogWriter);
    debug: (...args: unknown[]) => void;
    info: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
}
