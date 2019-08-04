import { ConsoleLogger } from "@yingyeothon/logger";
import { ActorSystem, InMemoryLock, InMemoryQueue } from "..";

interface IAdderMessage {
  delta: number;
}

interface IAdderContext {
  state?: "spawned" | "despawned";
  value: number;
}

const sleep = (millis: number) =>
  new Promise<void>(resolve => setTimeout(resolve, millis));

test("adder-shift", async () => {
  const ctx: IAdderContext = {
    value: 0
  };

  const sys = new ActorSystem({
    queue: new InMemoryQueue(),
    lock: new InMemoryLock(),
    logger: new ConsoleLogger("debug")
  });

  let shiftCount = 0;
  const ttl = 50;
  const actor = sys.spawn<IAdderMessage>("adder", newActor =>
    newActor
      .on("spawn", () => {
        ctx.state = "spawned";
      })
      .on("act", async ({ message }) => {
        ctx.value += message.delta;
        await sleep(ttl + 1);
      })
      .on("despawn", () => {
        ctx.state = "despawned";
      })
      .on("shift", () => {
        ++shiftCount;
      })
  );

  expect(ctx.state).toBeUndefined();
  expect(ctx.value).toEqual(0);
  expect(shiftCount).toEqual(0);

  await actor.post({ delta: 1 });
  expect(ctx.state).toBeUndefined();
  expect(ctx.value).toEqual(0);
  expect(shiftCount).toEqual(0);

  await actor.post({ delta: 1 });
  expect(ctx.state).toBeUndefined();
  expect(ctx.value).toEqual(0);
  expect(shiftCount).toEqual(0);

  await actor.post({ delta: 1 });
  expect(ctx.state).toBeUndefined();
  expect(ctx.value).toEqual(0);
  expect(shiftCount).toEqual(0);

  await actor.tryToProcess({
    shiftTimeout: ttl
  });
  expect(ctx.state).toEqual("spawned");
  expect(ctx.value).toEqual(1);
  expect(shiftCount).toEqual(1);

  await actor.tryToProcess({
    shiftTimeout: ttl
  });
  expect(ctx.state).toEqual("spawned");
  expect(ctx.value).toEqual(2);
  expect(shiftCount).toEqual(2);

  await actor.tryToProcess({
    shiftTimeout: ttl
  });
  expect(ctx.state).toEqual("spawned");
  expect(ctx.value).toEqual(3);

  // No shift because there is no more messages.
  expect(shiftCount).toEqual(2);

  await sys.despawn("adder");
  expect(ctx.state).toEqual("despawned");
  expect(ctx.value).toEqual(3);
  expect(shiftCount).toEqual(2);
});
