import LogSeverity from "./severity";
import LogWriter from "./writer";
export default interface Logger extends LogWriter {
    severity: LogSeverity;
}
