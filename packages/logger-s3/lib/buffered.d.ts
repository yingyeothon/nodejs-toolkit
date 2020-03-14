import LogSeverity from "@yingyeothon/logger/lib/severity";
import ILogTuple from "./model/tuple";
import { LogSerializer } from "./utils/serialize";
export interface IBufferedEnv {
    asKey: (date: Date, severity: LogSeverity) => string;
    autoFlushIntervalMillis?: number;
    autoFlushMaxBufferSize?: number;
    onAutoFlush: (tuples: ILogTuple[], timestamp: number) => any;
    serializer?: LogSerializer;
}
export default function buffered({ asKey, autoFlushIntervalMillis, autoFlushMaxBufferSize, onAutoFlush, serializer }: IBufferedEnv): {
    write: (severity: LogSeverity) => (...args: any[]) => void;
    flush: () => ILogTuple[];
};
