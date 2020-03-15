import S3CBEnv from "@yingyeothon/s3-cache-bridge-client/lib/env";
import ILogTuple from "./model/tuple";
import { LogSerializer } from "./utils/serialize";
export declare type S3CBLogFlushEnv = Partial<S3CBEnv> & {
    serializer?: LogSerializer;
};
export default function s3cbLogFlush({ apiUrl, apiId, apiPassword, serializer }: S3CBLogFlushEnv): (logs: ILogTuple[], timestamp: number) => Promise<void>;
