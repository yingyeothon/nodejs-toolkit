export interface ILogWriter {
    debug: (...args: any[]) => void;
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
}
export interface ILogger extends ILogWriter {
    severity: LogSeverity;
}
export declare type LogSeverity = "none" | "debug" | "info" | "error";
export declare const nullLogger: ILogger;
