import LogSeverity from "@yingyeothon/logger/lib/severity";
export declare type LogSerializer = (timestamp: Date, level: LogSeverity, args: any[]) => string;
export default function serialize(timestamp: Date, level: LogSeverity, args: any[]): string;
