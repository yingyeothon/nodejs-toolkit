import LogSeverity from "@yingyeothon/logger/lib/severity";
import LogTuple from "./model/tuple";
export interface BufferedEnv {
    asKey: (date: Date, severity: LogSeverity) => string;
    autoFlushIntervalMillis?: number;
    autoFlushMaxBufferSize?: number;
    onAutoFlush: (tuples: LogTuple[], timestamp: number) => unknown;
    withConsole?: boolean | ((tuple: Omit<LogTuple, "key">) => void);
}
export default function buffered({ asKey, autoFlushIntervalMillis, autoFlushMaxBufferSize, onAutoFlush, withConsole, }: BufferedEnv): {
    write: (severity: LogSeverity) => (...args: unknown[]) => void;
    flush: () => LogTuple[];
};
