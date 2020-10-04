import { S3LogWriterEnv } from "./writer";
import LogSeverity from "@yingyeothon/logger/lib/severity";
import Logger from "@yingyeothon/logger/lib/logger";
export declare type S3LoggerEnv = S3LogWriterEnv & {
    severity?: LogSeverity;
};
export interface S3Logger {
    logger: Logger;
    flush: () => Promise<unknown>;
}
export default function getS3Logger(env: S3LoggerEnv): S3Logger;
