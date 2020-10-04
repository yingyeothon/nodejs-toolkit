import S3LogWriter, { S3LogWriterEnv } from "./writer";

import FilteredLogger from "@yingyeothon/logger/lib/filtered";
import LogSeverity from "@yingyeothon/logger/lib/severity";
import Logger from "@yingyeothon/logger/lib/logger";

export type S3LoggerEnv = S3LogWriterEnv & {
  severity?: LogSeverity;
};

export interface S3Logger {
  logger: Logger;
  flush: () => Promise<unknown>;
}

export default function getS3Logger(env: S3LoggerEnv): S3Logger {
  const s3Writer = S3LogWriter(env);
  return {
    logger: new FilteredLogger(env.severity ?? "info", s3Writer),
    flush: s3Writer.flush,
  };
}
