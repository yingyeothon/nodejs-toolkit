import LogSeverity from "@yingyeothon/logger/lib/severity";
export declare type LogSerializer = (timestamp: Date, level: LogSeverity, args: unknown[]) => string;
export default function serializeAsJSON(timestamp: Date, level: LogSeverity, args: unknown[]): string;
