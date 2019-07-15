import { RedisQueue } from "..";
import { testRedis } from ".";
import { ConsoleLogger } from "@yingyeothon/actor-system";

interface IKeyValue {
  key: string;
  value: string;
}

testRedis("queue", async redis => {
  const queue = new RedisQueue({ redis, logger: new ConsoleLogger("debug") });
  const actorName = "test-actor";

  expect(await queue.size(actorName)).toBe(0);
  expect(await queue.peek(actorName)).toBe(null);
  expect(await queue.pop(actorName)).toBe(null);

  const tuple1: IKeyValue = { key: "hello", value: "world" };
  const tuple2: IKeyValue = { key: "hi", value: "there" };

  await queue.push(actorName, tuple1);
  expect(await queue.size(actorName)).toBe(1);
  expect(await queue.peek(actorName)).toEqual(tuple1);

  await queue.push(actorName, tuple2);
  expect(await queue.size(actorName)).toBe(2);
  expect(await queue.peek(actorName)).toEqual(tuple1);

  expect(await queue.pop(actorName)).toEqual(tuple1);
  expect(await queue.size(actorName)).toBe(1);
  expect(await queue.peek(actorName)).toEqual(tuple2);

  expect(await queue.pop(actorName)).toEqual(tuple2);
  expect(await queue.size(actorName)).toBe(0);
  expect(await queue.peek(actorName)).toBe(null);
});
