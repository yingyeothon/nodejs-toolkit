import LogSeverity from "@yingyeothon/logger/lib/severity";
export declare type LogSerializer = (timestamp: Date, level: LogSeverity, args: any[]) => string;
export default function serializeAsJSON(timestamp: Date, level: LogSeverity, args: any[]): string;
