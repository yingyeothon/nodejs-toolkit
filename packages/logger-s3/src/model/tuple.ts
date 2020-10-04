import LogSeverity from "@yingyeothon/logger/lib/severity";

export default interface LogTuple {
  key: string;
  timestamp: Date;
  severity: LogSeverity;
  args: unknown[];
}
