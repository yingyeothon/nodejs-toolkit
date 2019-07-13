import * as IORedis from "ioredis";
import { RedisRepository } from "..";

export const testRedis = async (
  name: string,
  cb: (repo: RedisRepository) => Promise<any>
) => {
  if (!process.env.TEST_REDIS_PORT || !process.env.TEST_REDIS_HOST) {
    console.log(`No test env: TEST_REDIS_PORT, TEST_REDIS_HOST`);
    return;
  }
  const repo = new RedisRepository({
    redis: new IORedis(
      +process.env.TEST_REDIS_PORT!,
      process.env.TEST_REDIS_HOST!
    )
  });
  test(name, async () => {
    await cb(repo);
  });
};
