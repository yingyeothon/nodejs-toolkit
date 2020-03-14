import FilteredLogger from "../filtered";
import LogSeverity from "../severity";
import consoleWriter from "./writer";

export default class ConsoleLogger extends FilteredLogger {
  constructor(public severity: LogSeverity = "info") {
    super(severity, consoleWriter);
  }
}
