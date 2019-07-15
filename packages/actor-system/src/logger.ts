export interface ILogger {
  severity: LogSeverity;

  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

type LogSeverity = "debug" | "info" | "error";

export class ConsoleLogger implements ILogger {
  constructor(public severity: LogSeverity = "info") {}

  public debug = (...args: any[]) =>
    this.severity === "debug" ? console.debug(...args) : undefined;

  public info = (...args: any[]) =>
    this.severity === "debug" || this.severity === "info"
      ? console.info(...args)
      : undefined;

  public error = (...args: any[]) => console.error(...args);
}
