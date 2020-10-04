export interface Codec<B> {
  encode<T>(item: T): B;
  decode<T>(value: B): T;
}

export class JsonCodec implements Codec<string> {
  private static readonly Undefined = "undefined";

  public encode<T>(item: T): string {
    if (item === undefined) {
      return JsonCodec.Undefined;
    }
    return JSON.stringify(item);
  }
  public decode<T>(value: string): T {
    if (value === undefined) {
      throw new Error(`Value cannot be undefined`);
    }
    return JSON.parse(value) as T;
  }
}
