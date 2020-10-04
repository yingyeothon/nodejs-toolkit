import { BufferedEnv } from "./buffered";
import { S3CBLogFlushEnv } from "./s3cbLogFlush";
import LogWriter from "@yingyeothon/logger/lib/writer";
export declare type S3LogWriterEnv = S3CBLogFlushEnv & Omit<BufferedEnv, "onAutoFlush">;
export default function S3LogWriter(env: S3LogWriterEnv): LogWriter & {
    flush: () => Promise<unknown>;
};
