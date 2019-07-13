import { IExpirableRepository, IRepository, SimpleRepository } from "..";

interface IExpirableDocument {
  expired?: number;
  value: any;
}

class InMemoryRepository extends SimpleRepository
  implements IExpirableRepository {
  private readonly store: { [key: string]: IExpirableDocument } = {};

  public async get<T>(key: string) {
    const doc = this.store[key];
    if (!doc) {
      return null;
    }
    if (doc.expired > 0 && doc.expired < Date.now()) {
      return null;
    }
    return doc.value as T;
  }

  public async set<T>(key: string, value: T) {
    this.store[key] = {
      value
    };
  }

  public async delete(key: string) {
    delete this.store[key];
  }

  public async setWithExpire<T>(
    key: string,
    value: T,
    expiresInMillis: number
  ) {
    this.store[key] = {
      expired: expiresInMillis > 0 ? Date.now() + expiresInMillis : 0,
      value
    };
  }
}

test("get-after-set", async () => {
  const mem: IRepository = new InMemoryRepository();
  const key = "hello";
  const expected = { hi: "there" };
  await mem.set(key, expected);
  expect(await mem.get(key)).toEqual(expected);
});

test("get-null-if-absent", async () => {
  const mem: IRepository = new InMemoryRepository();
  const key = "hello";
  expect(await mem.get(key)).toBeNull();
});

test("get-null-if-deleted", async () => {
  const mem: IRepository = new InMemoryRepository();
  const key = "hello";
  const expected = { hi: "there" };
  await mem.set(key, expected);
  expect(await mem.get(key)).toEqual(expected);

  await mem.delete(key);
  expect(await mem.get(key)).toBeNull();
});

const sleep = (millis: number) =>
  new Promise<void>(resolve => setTimeout(resolve, millis));

test("get-null-after-expired", async () => {
  const mem: IExpirableRepository = new InMemoryRepository();
  const key = "hello";
  const expected = { hi: "there" };
  const ttl = 10;
  await mem.setWithExpire(key, expected, ttl);
  expect(await mem.get(key)).toEqual(expected);

  await sleep(ttl + 1);
  expect(await mem.get(key)).toBeNull();
});
