import LogSeverity from "@yingyeothon/logger/lib/severity";
import { serializeError } from "serialize-error";
import S3Logger, { IS3Logger, S3LoggerEnv } from "./logger";
import ILogTuple from "./model/tuple";
import yyyyMMdd from "./utils/yyyyMMdd";

interface ILambdaInfo {
  systemName?: string;
  systemId?: string;
  handlerName?: string;
  lambdaId?: string;
}

export type LambdaS3LoggerEnv = Omit<S3LoggerEnv, "asKey"> &
  ILambdaInfo & {
    logKeyPrefix?: string;
    asKey?: S3LoggerEnv["asKey"];
  };

export interface ILambdaS3Logger extends IS3Logger {
  updateSystemId: (systemId: string) => void;
}

export default function LambdaS3Logger(
  env: LambdaS3LoggerEnv
): ILambdaS3Logger {
  const { systemName, handlerName, lambdaId } = env;
  function serialize(timestamp: Date, level: LogSeverity, args: any[]) {
    return (
      JSON.stringify({
        timestamp: timestamp.toISOString(),
        level,
        systemName,
        systemId: env.systemId,
        handlerName,
        lambdaId,
        args: args.map(arg =>
          arg instanceof Error ? serializeError(arg) : arg
        )
      }) + "\n"
    );
  }

  function writeConsole({ timestamp, severity, args }: Omit<ILogTuple, "key">) {
    console[severity](
      timestamp.toISOString(),
      severity.toUpperCase(),
      ...[systemName, env.systemId, handlerName, lambdaId].map(v =>
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

  const s3Logger = S3Logger({
    asKey: () =>
      [env.logKeyPrefix, systemName, yyyyMMdd()].filter(Boolean).join("/"),
    serializer: serialize,
    withConsole: writeConsole,
    ...env
  });
  return { ...s3Logger, updateSystemId };
}
