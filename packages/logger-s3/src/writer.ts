import buffered, { BufferedEnv } from "./buffered";
import s3cbLogFlush, { S3CBLogFlushEnv } from "./s3cbLogFlush";

import LogWriter from "@yingyeothon/logger/lib/writer";

export type S3LogWriterEnv = S3CBLogFlushEnv & Omit<BufferedEnv, "onAutoFlush">;

export default function S3LogWriter(
  env: S3LogWriterEnv
): LogWriter & { flush: () => Promise<unknown> } {
  const s3cbFlush = s3cbLogFlush(env);
  const { write: bufferWrite, flush: bufferFlush } = buffered({
    ...env,
    onAutoFlush: s3cbFlush,
  });
  return {
    debug: bufferWrite("debug"),
    info: bufferWrite("info"),
    error: bufferWrite("error"),
    flush: () => s3cbFlush(bufferFlush(), Date.now()),
  };
}
