import LogSeverity from "@yingyeothon/logger/lib/severity";
import { serializeError } from "serialize-error";

export type LogSerializer = (
  timestamp: Date,
  level: LogSeverity,
  args: any[]
) => string;

export default function serialize(
  timestamp: Date,
  level: LogSeverity,
  args: any[]
): string {
  return (
    JSON.stringify({
      level,
      timestamp: timestamp.toISOString(),
      args: args.map(arg => {
        if (arg instanceof Error) {
          return serializeError(arg);
        }
        return arg;
      })
    }) + "\n"
  );
}
