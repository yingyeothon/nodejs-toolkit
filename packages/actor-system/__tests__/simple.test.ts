import { ActorSystem, InMemoryQueue, InMemoryLock, ConsoleLogger } from "..";

interface IAdderMessage {
  delta: number;
}

interface IAdderContext {
  state?: "spawned" | "despawned";
  value: number;
}

test("adder-simple", async () => {
  const ctx: IAdderContext = {
    value: 0
  };

  const sys = new ActorSystem({
    queue: new InMemoryQueue(),
    lock: new InMemoryLock(),
    logger: new ConsoleLogger("debug")
  });
  const actor = sys
    .spawn<IAdderMessage>("adder")
    .on("spawn", () => {
      ctx.state = "spawned";
    })
    .on("act", ({ message }) => {
      ctx.value += message.delta;
    })
    .on("despawn", () => {
      ctx.state = "despawned";
    });

  expect(ctx.state).toBeUndefined();
  expect(ctx.value).toEqual(0);

  await actor.post({ delta: 1 });
  expect(ctx.state).toBeUndefined();
  expect(ctx.value).toEqual(0);

  await actor.post({ delta: 1 });
  expect(ctx.state).toBeUndefined();
  expect(ctx.value).toEqual(0);

  await actor.post({ delta: 1 });
  expect(ctx.state).toBeUndefined();
  expect(ctx.value).toEqual(0);

  await actor.tryToProcess();
  expect(ctx.state).toEqual("spawned");
  expect(ctx.value).toEqual(3);

  await sys.despawn("adder");
  expect(ctx.state).toEqual("despawned");
  expect(ctx.value).toEqual(3);
});
