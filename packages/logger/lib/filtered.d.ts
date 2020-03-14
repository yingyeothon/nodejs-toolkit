import ILogger from "./logger";
import LogSeverity from "./severity";
import ILogWriter from "./writer";
export default class FilteredLogger implements ILogger {
    severity: LogSeverity;
    private readonly writer;
    constructor(severity: LogSeverity, writer: ILogWriter);
    debug: (...args: any[]) => void;
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
}
