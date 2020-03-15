import LogSeverity from "@yingyeothon/logger/lib/severity";
import ILogTuple from "./model/tuple";
export interface IBufferedEnv {
    asKey: (date: Date, severity: LogSeverity) => string;
    autoFlushIntervalMillis?: number;
    autoFlushMaxBufferSize?: number;
    onAutoFlush: (tuples: ILogTuple[], timestamp: number) => any;
    withConsole?: boolean | ((tuple: Omit<ILogTuple, "key">) => void);
}
export default function buffered({ asKey, autoFlushIntervalMillis, autoFlushMaxBufferSize, onAutoFlush, withConsole }: IBufferedEnv): {
    write: (severity: LogSeverity) => (...args: any[]) => void;
    flush: () => ILogTuple[];
};
