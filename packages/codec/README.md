# Codec Stub

A simple stub for codec such as `JsonCodec`.

## Usage

```typescript
import { JsonCodec } from "@yingyeothon/codec";

interface IMessage {
  payload: string;
}

const message: IMessage = {
  payload: "Hello, world!"
};

const codec = new JsonCodec();
const encoded = codec.encode(message);
const decoded = codec.decode<IMessage>(encoded);
```

And we can implement new codec from `ICodec` interface.

```typescript
import { ICodec } from "@yingyeothon/codec";

class ByteCodec implements ICodec<Uint8Array> {
  public encode<T>(item: T): Uint8Array {
    // ...
  }

  public decode<T>(value: Uint8Array): T {
    // ...
  }
}
```

## License

MIT
