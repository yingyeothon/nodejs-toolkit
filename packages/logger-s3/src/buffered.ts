import LogSeverity from "@yingyeothon/logger/lib/severity";
import ILogTuple from "./model/tuple";
import { debugPrint } from "./utils/debug";
import serialize, { LogSerializer } from "./utils/serialize";

export interface IBufferedEnv {
  asKey: (date: Date, severity: LogSeverity) => string;
  autoFlushIntervalMillis?: number;
  autoFlushMaxBufferSize?: number;
  onAutoFlush: (tuples: ILogTuple[], timestamp: number) => any;
  serializer?: LogSerializer;
}

export default function buffered({
  asKey,
  autoFlushIntervalMillis = 10 * 1000,
  autoFlushMaxBufferSize = 1024,
  onAutoFlush,
  serializer = serialize
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
        body: serializer(now, severity, args)
      });

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
