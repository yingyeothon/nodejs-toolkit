import LogSeverity from "./severity";
import LogWriter from "./writer";
import Logger from "./logger";

function filteredLogger(
  severity: LogSeverity,
  callback: (...args: unknown[]) => void
) {
  const thisLevel = asLevel(severity);
  return (configuredSeverity: LogSeverity, ...args: unknown[]): void => {
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

export default class FilteredLogger implements Logger {
  constructor(
    public severity: LogSeverity,
    private readonly writer: LogWriter
  ) {}

  public debug = (...args: unknown[]): void =>
    filteredLogger("debug", this.writer.debug)(this.severity, ...args);

  public info = (...args: unknown[]): void =>
    filteredLogger("info", this.writer.info)(this.severity, ...args);

  public error = (...args: unknown[]): void =>
    filteredLogger("error", this.writer.error)(this.severity, ...args);
}
