import { ConsoleLogger } from "@yingyeothon/actor-system";
import { RedisLock } from "..";
import { testRedis } from ".";

testRedis("lock", async redis => {
  const lock = new RedisLock({ redis, logger: new ConsoleLogger("debug") });
  const actorName = "test-actor";
  await lock.release(actorName);

  expect(await lock.tryAcquire(actorName)).toBe(true);
  expect(await lock.tryAcquire(actorName)).toBe(false);
  expect(await lock.tryAcquire(actorName)).toBe(false);

  expect(await lock.release(actorName)).toBe(true);
  expect(await lock.tryAcquire(actorName)).toBe(true);
  expect(await lock.tryAcquire(actorName)).toBe(false);
  expect(await lock.release(actorName)).toBe(true);
});
