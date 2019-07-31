# Logger

A deadly simple logger for other libraries.

## Usage

```typescript
import { ILogger, ConsoleLogger } from "@yingyeothon/logger";

const doSomething = (
  logger: ILogger = new ConsoleLogger(/* severity = `info` */)
) => {
  try {
    logger.debug(`Hello`, `World`);
    logger.info(`Info with` /*, Some object can be placed in here. */);
  } catch (error) {
    logger.error(`Error occurred`, error);
  }
};
```
