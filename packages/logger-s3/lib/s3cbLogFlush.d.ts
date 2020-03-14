import S3CBEnv from "@yingyeothon/s3-cache-bridge-client/lib/env";
import ILogTuple from "./model/tuple";
export declare type S3CBLogFlushEnv = Partial<S3CBEnv>;
export default function s3cbLogFlush({ apiUrl, apiId, apiPassword }: S3CBLogFlushEnv): (logs: ILogTuple[], timestamp: number) => Promise<void>;
