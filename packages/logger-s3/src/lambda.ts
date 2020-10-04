import getS3Logger, { S3Logger, S3LoggerEnv } from "./logger";

import LogSeverity from "@yingyeothon/logger/lib/severity";
import LogTuple from "./model/tuple";
import { serializeError } from "serialize-error";
import yyyyMMdd from "./utils/yyyyMMdd";

interface LambdaInfo {
  systemName?: string;
  systemId?: string;
  handlerName?: string;
  lambdaId?: string;
}

export type LambdaS3LoggerEnv = Omit<S3LoggerEnv, "asKey"> &
  LambdaInfo & {
    logKeyPrefix?: string;
    asKey?: S3LoggerEnv["asKey"];
  };

export interface ILambdaS3Logger extends S3Logger {
  updateSystemId: (systemId: string) => void;
}

export default function LambdaS3Logger(
  env: LambdaS3LoggerEnv
): ILambdaS3Logger {
  const { systemName, handlerName, lambdaId } = env;
  function serialize(timestamp: Date, level: LogSeverity, args: unknown[]) {
    return (
      JSON.stringify({
        timestamp: timestamp.toISOString(),
        level,
        systemName,
        systemId: env.systemId,
        handlerName,
        lambdaId,
        args: args.map((arg) =>
          arg instanceof Error ? serializeError(arg) : arg
        ),
      }) + "\n"
    );
  }

  function writeConsole({ timestamp, severity, args }: Omit<LogTuple, "key">) {
    console[severity](
      timestamp.toISOString(),
      severity.toUpperCase(),
      ...[systemName, env.systemId, handlerName, lambdaId].map((v) =>
        v === undefined ? "null" : v
      ),
      ...args
    );
  }

  function updateSystemId(systemId: string) {
    env.systemId = systemId;
  }

  if (!env.asKey && !env.logKeyPrefix && !env.systemName) {
    throw new Error(
      "Please set one of `asKey`, `logKeyPrefix` and `systemName` at least"
    );
  }

  const s3Logger = getS3Logger({
    asKey: () =>
      [env.logKeyPrefix, systemName, yyyyMMdd()].filter(Boolean).join("/"),
    serializer: serialize,
    withConsole: writeConsole,
    ...env,
  });
  return { ...s3Logger, updateSystemId };
}
