import LogSeverity from "./severity";
import LogWriter from "./writer";
import nullLogger from "./null";

export default function combine(...writers: LogWriter[]): LogWriter {
  function severityWith(severity: LogSeverity) {
    return function (...args: unknown[]): void {
      writers
        .filter((writer) => writer !== nullLogger)
        .forEach((writer) => {
          writer[severity](...args);
        });
    };
  }

  const combined: Partial<LogWriter> = {};
  for (const severity of ["debug", "info", "error"] as LogSeverity[]) {
    combined[severity] = severityWith(severity);
  }
  return combined as LogWriter;
}
