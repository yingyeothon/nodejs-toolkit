import ILogger from "./logger";
import LogSeverity from "./severity";
import ILogWriter from "./writer";

function filteredLogger(
  severity: LogSeverity,
  callback: (...args: any[]) => void
) {
  const thisLevel = asLevel(severity);
  return (configuredSeverity: LogSeverity, ...args: any[]) => {
    const configuredLevel = asLevel(configuredSeverity);
    if (thisLevel >= configuredLevel) {
      callback(...args);
    }
  };
}

function asLevel(severity: LogSeverity) {
  switch (severity) {
    case "debug":
      return 100;
    case "info":
      return 500;
    case "error":
      return 900;
  }
  return 0;
}

export default class FilteredLogger implements ILogger {
  constructor(
    public severity: LogSeverity,
    private readonly writer: ILogWriter
  ) {}

  public debug = (...args: any[]) =>
    filteredLogger("debug", this.writer.debug)(this.severity, ...args);

  public info = (...args: any[]) =>
    filteredLogger("info", this.writer.info)(this.severity, ...args);

  public error = (...args: any[]) =>
    filteredLogger("error", this.writer.error)(this.severity, ...args);
}
