import LogSeverity from "@yingyeothon/logger/lib/severity";
import { serializeError } from "serialize-error";

export type LogSerializer = (
  timestamp: Date,
  level: LogSeverity,
  args: unknown[]
) => string;

export default function serializeAsJSON(
  timestamp: Date,
  level: LogSeverity,
  args: unknown[]
): string {
  return (
    JSON.stringify({
      level,
      timestamp: timestamp.toISOString(),
      args: args.map((arg) => {
        if (arg instanceof Error) {
          return serializeError(arg);
        }
        return arg;
      }),
    }) + "\n"
  );
}
