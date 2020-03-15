import ILogBag from "../model/bag";

export default function aggregate(
  buffer: Array<{ key: string; body: string }>
): ILogBag {
  const bag: ILogBag = {};
  for (const { key, body } of buffer) {
    if (key in bag) {
      bag[key] += body;
    } else {
      bag[key] = body;
    }
  }
  return bag;
}
