import LogBag from "../model/bag";

export default function aggregate(
  buffer: Array<{ key: string; body: string }>
): LogBag {
  const bag: LogBag = {};
  for (const { key, body } of buffer) {
    if (key in bag) {
      bag[key] += body;
    } else {
      bag[key] = body;
    }
  }
  return bag;
}
