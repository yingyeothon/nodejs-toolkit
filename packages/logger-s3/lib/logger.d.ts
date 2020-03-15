import ILogger from "@yingyeothon/logger/lib/logger";
import LogSeverity from "@yingyeothon/logger/lib/severity";
import { S3LogWriterEnv } from "./writer";
export declare type S3LoggerEnv = S3LogWriterEnv & {
    severity?: LogSeverity;
};
export interface IS3Logger {
    logger: ILogger;
    flush: () => Promise<any>;
}
export default function S3Logger(env: S3LoggerEnv): IS3Logger;
