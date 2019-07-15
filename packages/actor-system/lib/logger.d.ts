export interface ILogger {
    severity: LogSeverity;
    debug: (...args: any[]) => void;
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
}
declare type LogSeverity = "debug" | "info" | "error";
export declare class ConsoleLogger implements ILogger {
    severity: LogSeverity;
    constructor(severity?: LogSeverity);
    debug: (...args: any[]) => void;
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
}
export {};
