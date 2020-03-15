import LogSeverity from "@yingyeothon/logger/lib/severity";
export default interface ILogTuple {
    key: string;
    timestamp: Date;
    severity: LogSeverity;
    args: any[];
}
