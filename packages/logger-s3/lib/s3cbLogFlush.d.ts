import { LogSerializer } from "./utils/serialize";
import LogTuple from "./model/tuple";
import S3CBEnv from "@yingyeothon/s3-cache-bridge-client/lib/env";
export declare type S3CBLogFlushEnv = Partial<S3CBEnv> & {
    serializer?: LogSerializer;
};
export default function s3cbLogFlush({ apiUrl, apiId, apiPassword, serializer, }: S3CBLogFlushEnv): (logs: LogTuple[], timestamp: number) => Promise<void>;
