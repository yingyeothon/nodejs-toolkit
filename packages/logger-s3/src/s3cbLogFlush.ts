import S3CB from "@yingyeothon/s3-cache-bridge-client";
import S3CBEnv from "@yingyeothon/s3-cache-bridge-client/lib/env";
import ILogTuple from "./model/tuple";
import aggregate from "./utils/aggregate";
import { debugPrint } from "./utils/debug";

export type S3CBLogFlushEnv = Partial<S3CBEnv>;

export default function s3cbLogFlush({
  apiUrl = process.env.S3CB_URL,
  apiId = process.env.S3CB_ID,
  apiPassword = process.env.S3CB_PASSWORD
}: S3CBLogFlushEnv) {
  if (apiUrl === undefined) {
    throw new Error("No URL for S3CB");
  }
  const s3cb = S3CB({
    apiUrl,
    apiId,
    apiPassword
  });
  let promise: Promise<void> = Promise.resolve();

  function flush(logs: ILogTuple[], timestamp: number) {
    if (logs.length === 0) {
      debugPrint("S3CB", "Nothing to flush", timestamp);
      return Promise.resolve();
    }
    const bag = aggregate(logs);
    return (promise = promise.then(async () => {
      debugPrint("S3CB", "Do flush", timestamp, bag);
      await Promise.all(
        Object.entries(bag).map(([key, body]) => s3cb.append(key, body))
      );
    }));
  }
  return flush;
}