import FilteredLogger from "@yingyeothon/logger/lib/filtered";
import LogSeverity from "@yingyeothon/logger/lib/severity";
import { S3LogWriterEnv } from "./writer";
declare type S3LoggerEnv = S3LogWriterEnv & {
    severity?: LogSeverity;
    withConsole?: boolean;
};
export default function S3Logger(env: S3LoggerEnv): {
    logger: FilteredLogger;
    flush: () => Promise<any>;
};
export {};
