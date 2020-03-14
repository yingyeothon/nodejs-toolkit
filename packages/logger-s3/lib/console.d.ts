import { FilteredLogger } from "./filtered";
import { LogSeverity } from "./logger";
export declare class ConsoleLogger extends FilteredLogger {
    severity: LogSeverity;
    constructor(severity?: LogSeverity);
}
