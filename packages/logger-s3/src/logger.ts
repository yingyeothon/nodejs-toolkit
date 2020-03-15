import FilteredLogger from "@yingyeothon/logger/lib/filtered";
import ILogger from "@yingyeothon/logger/lib/logger";
import LogSeverity from "@yingyeothon/logger/lib/severity";
import S3LogWriter, { S3LogWriterEnv } from "./writer";

export type S3LoggerEnv = S3LogWriterEnv & {
  severity?: LogSeverity;
};

export interface IS3Logger {
  logger: ILogger;
  flush: () => Promise<any>;
}

export default function S3Logger(env: S3LoggerEnv): IS3Logger {
  const s3Writer = S3LogWriter(env);
  return {
    logger: new FilteredLogger(env.severity ?? "info", s3Writer),
    flush: s3Writer.flush
  };
}
