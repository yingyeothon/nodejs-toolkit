import LogSeverity from "@yingyeothon/logger/lib/severity";
import ILogTuple from "./model/tuple";
import { debugPrint } from "./utils/debug";

export interface IBufferedEnv {
  asKey: (date: Date, severity: LogSeverity) => string;
  autoFlushIntervalMillis?: number;
  autoFlushMaxBufferSize?: number;
  onAutoFlush: (tuples: ILogTuple[], timestamp: number) => any;
  withConsole?: boolean | ((tuple: Omit<ILogTuple, "key">) => void);
}

export default function buffered({
  asKey,
  autoFlushIntervalMillis = 10 * 1000,
  autoFlushMaxBufferSize = 1024,
  onAutoFlush,
  withConsole = false
}: IBufferedEnv) {
  let lastFlushed = Date.now();
  let buffer: ILogTuple[] = [];

  function isAutoFlushable() {
    return (
      Date.now() - lastFlushed > autoFlushIntervalMillis ||
      buffer.length > autoFlushMaxBufferSize
    );
  }

  function write(severity: LogSeverity) {
    return (...args: any[]) => {
      const now = new Date();
      buffer.push({
        key: asKey(now, severity),
        timestamp: now,
        severity,
        args
      });

      // Support console bypass.
      if (typeof withConsole === "boolean") {
        if (withConsole) {
          console[severity](now.toISOString(), severity, ...args);
        }
      } else {
        withConsole({ timestamp: now, severity, args });
      }

      if (isAutoFlushable()) {
        const timestamp = Date.now();
        debugPrint("BUFFERED", "Try to auto flush", timestamp);
        const flushed = flush();
        if (flushed.length > 0) {
          debugPrint("BUFFERED", "Do auto flush", timestamp);
          onAutoFlush(flushed, timestamp);
        } else {
          debugPrint("BUFFERED", "Nothing to auto flush", timestamp);
        }
      }
    };
  }

  function flush() {
    const logs = buffer;
    buffer = [];
    lastFlushed = Date.now();
    return logs;
  }

  return { write, flush };
}
