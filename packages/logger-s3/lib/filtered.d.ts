import { ILogger, ILogWriter, LogSeverity } from "./logger";
export declare class FilteredLogger implements ILogger {
    severity: LogSeverity;
    private readonly writer;
    constructor(severity: LogSeverity, writer: ILogWriter);
    debug: (...args: any[]) => void;
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
}
