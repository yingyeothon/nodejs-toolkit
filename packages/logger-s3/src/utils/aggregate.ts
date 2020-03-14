import ILogBag from "../model/bag";
import ILogTuple from "../model/tuple";

export default function aggregate(buffer: ILogTuple[]): ILogBag {
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
