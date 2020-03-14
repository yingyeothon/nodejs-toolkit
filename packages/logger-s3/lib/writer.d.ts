import ILogWriter from "@yingyeothon/logger/lib/writer";
import { IBufferedEnv } from "./buffered";
import { S3CBLogFlushEnv } from "./s3cbLogFlush";
export declare type S3LogWriterEnv = S3CBLogFlushEnv & Omit<IBufferedEnv, "onAutoFlush">;
export default function S3LogWriter(env: S3LogWriterEnv): ILogWriter & {
    flush: () => Promise<any>;
};
