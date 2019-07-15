import * as IORedis from "ioredis";

export const testRedis = async (
  name: string,
  cb: (redis: IORedis.Redis) => Promise<any>
) => {
  if (!process.env.TEST_REDIS_PORT || !process.env.TEST_REDIS_HOST) {
    console.log(`No test env: TEST_REDIS_PORT, TEST_REDIS_HOST`);

    // A dummy test to ignore jest errors.
    test(name, () => expect(true).toEqual(true));
    return;
  }
  const redis = new IORedis(
    +process.env.TEST_REDIS_PORT!,
    process.env.TEST_REDIS_HOST!
  );
  test(name, async () => {
    await cb(redis);
  });
};
