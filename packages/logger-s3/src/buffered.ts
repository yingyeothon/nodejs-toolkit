import LogSeverity from "@yingyeothon/logger/lib/severity";
import LogTuple from "./model/tuple";
import { debugPrint } from "./utils/debug";

export interface BufferedEnv {
  asKey: (date: Date, severity: LogSeverity) => string;
  autoFlushIntervalMillis?: number;
  autoFlushMaxBufferSize?: number;
  onAutoFlush: (tuples: LogTuple[], timestamp: number) => unknown;
  withConsole?: boolean | ((tuple: Omit<LogTuple, "key">) => void);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function buffered({
  asKey,
  autoFlushIntervalMillis = 10 * 1000,
  autoFlushMaxBufferSize = 1024,
  onAutoFlush,
  withConsole = false,
}: BufferedEnv) {
  let lastFlushed = Date.now();
  let buffer: LogTuple[] = [];

  function isAutoFlushable() {
    return (
      Date.now() - lastFlushed > autoFlushIntervalMillis ||
      buffer.length > autoFlushMaxBufferSize
    );
  }

  function write(severity: LogSeverity) {
    return (...args: unknown[]) => {
      const now = new Date();
      buffer.push({
        key: asKey(now, severity),
        timestamp: now,
        severity,
        args,
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
