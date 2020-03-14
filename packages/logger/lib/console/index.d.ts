import FilteredLogger from "../filtered";
import LogSeverity from "../severity";
export default class ConsoleLogger extends FilteredLogger {
    severity: LogSeverity;
    constructor(severity?: LogSeverity);
}
