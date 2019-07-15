import { EventBroker } from "..";

interface IBoxEventMap {
  data: string;
  error: Error;
  finish: void;
}

// tslint:disable:max-classes-per-file
class SyncBox extends EventBroker<IBoxEventMap> {
  public call(error: Error, data: string) {
    if (error) {
      this.fire("error", error);
    }
    if (data) {
      this.fire("data", data);
    }
    this.fire("finish", undefined);
  }
}

class AsyncBox extends EventBroker<IBoxEventMap> {
  public async call(error: Error, data: string) {
    if (error) {
      await this.fire("error", error);
    }
    if (data) {
      await this.fire("data", data);
    }
    await this.fire("finish", undefined);
  }
}

test("call-data-only", () => {
  new SyncBox()
    .on("data", value => expect(value).toEqual("hello"))
    .on("error", error => expect(error).toBeFalsy())
    .call(null, "hello");
});

test("call-error-only", () => {
  new SyncBox()
    .on("data", value => expect(value).toBeFalsy())
    .on("error", error => expect(error).toBeDefined())
    .call(new Error(), null);
});

test("call-many-sync-handlers", () => {
  const expectedData = "hello";
  let counter = 0;
  const checkCounter = <T>(expectedCounter: number, expectedValue: T) => (
    actualValue: T
  ) => {
    expect(actualValue).toEqual(expectedValue);
    expect(counter).toEqual(expectedCounter);
    ++counter;
  };
  new SyncBox()
    .on("data", checkCounter(0, expectedData))
    .on("data", checkCounter(1, expectedData))
    .on("data", checkCounter(2, expectedData))
    .on("data", checkCounter(3, expectedData))
    .on("finish", checkCounter(4, undefined))
    .call(null, expectedData);
  expect(counter).toEqual(5);
});

test("call-many-async-handlers", async () => {
  const sleep = (millis: number) =>
    new Promise<void>(resolve => setTimeout(resolve, millis));

  const expectedData = "hello";
  let counter = 0;
  const checkCounter = <T>(expectedCounter: number, expectedValue: T) => async (
    actualValue: T
  ) => {
    await sleep(1);
    expect(actualValue).toEqual(expectedValue);
    expect(counter).toEqual(expectedCounter);
    ++counter;
  };
  const promise = new AsyncBox()
    .on("data", checkCounter(0, expectedData))
    .on("data", checkCounter(1, expectedData))
    .on("data", checkCounter(2, expectedData))
    .on("data", checkCounter(3, expectedData))
    .on("finish", checkCounter(4, undefined))
    .call(null, expectedData);
  await promise;
  expect(counter).toEqual(5);
});
