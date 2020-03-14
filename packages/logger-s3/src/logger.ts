import combine from "@yingyeothon/logger/lib/combine";
import consoleWriter from "@yingyeothon/logger/lib/console/writer";
import FilteredLogger from "@yingyeothon/logger/lib/filtered";
import nullLogger from "@yingyeothon/logger/lib/null";
import LogSeverity from "@yingyeothon/logger/lib/severity";
import S3LogWriter, { S3LogWriterEnv } from "./writer";

type S3LoggerEnv = S3LogWriterEnv & {
  severity?: LogSeverity;
  withConsole?: boolean;
};

export default function S3Logger(env: S3LoggerEnv) {
  const s3Writer = S3LogWriter(env);
  const writer = combine(
    s3Writer,
    env.withConsole ? consoleWriter : nullLogger
  );
  return {
    logger: new FilteredLogger(env.severity ?? "info", writer),
    flush: s3Writer.flush
  };
}
