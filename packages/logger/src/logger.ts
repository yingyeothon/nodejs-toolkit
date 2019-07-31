export interface ILogWriter {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

export interface ILogger extends ILogWriter {
  severity: LogSeverity;
}

export type LogSeverity = "none" | "debug" | "info" | "error";

export const nullLogger: ILogger = {
  severity: "none",
  debug: () => 0,
  info: () => 0,
  error: () => 0
};
