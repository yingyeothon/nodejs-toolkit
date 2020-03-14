import LogSeverity from "./severity";
import ILogWriter from "./writer";

export default interface ILogger extends ILogWriter {
  severity: LogSeverity;
}
