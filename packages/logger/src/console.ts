import { FilteredLogger } from "./filtered";
import { LogSeverity } from "./logger";

export class ConsoleLogger extends FilteredLogger {
  constructor(public severity: LogSeverity = "info") {
    super(severity, {
      debug: console.debug,
      info: console.info,
      error: console.error
    });
  }
}
