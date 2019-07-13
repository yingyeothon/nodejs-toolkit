import { JsonCodec } from "..";

interface IContext {
  a: number;
  b: string;
  c: {
    d: number;
    e: string;
  };
}

test("codec", () => {
  const ctx: IContext = {
    a: 10,
    b: "hello",
    c: {
      d: 20,
      e: "world"
    }
  };
  const codec = new JsonCodec();
  expect(codec.decode<IContext>(codec.encode(ctx))).toEqual(ctx);
});
