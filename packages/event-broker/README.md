# Event Broker

A simple event broker with asynchronous handlers.

## Usage

```typescript
import { EventBroker } from "@yingyeothonevent-broker";

interface IReaderEventMap {
  read: string;
  error: Error;
}

class Reader extends EventBroker<IReaderEventMap> {
  public async start() {
    try {
      while (true) {
        const buffer = this.readMore();
        if (!buffer) {
          break;
        }
        await this.fire("read", buffer);
      }
    } catch (error) {
      await this.fire("error", error);
    }
  }
}

new Reader()
  .on("read", console.log)
  .on("error", console.error)
  .start();
```

Of course, we don't need to await a result from `fire` method if there is no asynchronous handler.

## License

MIT
