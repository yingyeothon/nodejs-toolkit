import nullLogger from "./null";
import LogSeverity from "./severity";
import ILogWriter from "./writer";

export default function combine(...writers: ILogWriter[]): ILogWriter {
  const combined: Partial<ILogWriter> = {};
  for (const severity of ["debug", "info", "error"] as LogSeverity[]) {
    combined[severity] = (...args: any[]) => {
      writers
        .filter(writer => writer !== nullLogger)
        .forEach(writer => {
          writer[severity](...args);
        });
    };
  }
  return combined as ILogWriter;
}
