# Logger S3

A library to send logs into S3 via [s3-cache-bridge](https://github.com/lacti/s3-cache-bridge).

![Logger](_docs/logger.png)

## Usage

```typescript
import LogSeverity from "@yingyeothon/logger/lib/severity";
import S3Logger from "@yingyeothon/logger-s3";
import { serializeError } from "serialize-error";

function buildLogFileName(date: Date, severity: LogSeverity) {
  function zeroPad(value: number, length: number) {
    return `0${value}`.slice(-length);
  }
  return [
    "logging",
    "mylog",
    severity,
    date.getFullYear() +
      zeroPad(date.getMonth() + 1, 2) +
      zeroPad(date.getDate(), 2)
  ].join("/");
}

const { logger, flush } = S3Logger({
  // A function to build the S3 Key of logging file.
  asKey: buildLogFileName,

  // Connection information for s3-cache-bridge
  // https://github.com/lacti/s3-cache-bridge#environment
  apiUrl: "http://localhost:3000/", // Or, process.env.S3CB_URL
  // Optional credential for S3CB.
  apiId: "test", // Or, process.env.S3CB_ID
  apiPassword: " test", // Or, process.env.S3CB_PASSWORD

  // Default parameters.
  // Serialize as JSON.
  serializer: (timestamp, level, args) =>
    JSON.stringify({
      level,
      timestamp: timestamp.toISOString(),
      args: args.map(arg => {
        if (arg instanceof Error) {
          return serializeError(arg);
        }
        return arg;
      })
    }) + "\n",
  autoFlushIntervalMillis: 10 * 1000,
  autoFlushMaxBufferSize: 1024,
  severity: "info",
  withConsole: false
});

async function main() {
  try {
    logger.debug(`Hello`, `World`);
    logger.info(`Info with` /*, Some object can be placed in here. */);
  } catch (error) {
    logger.error(`Error occurred`, error);
  }
  await flush();
}
```

### Simplified

If `process.env.S3CB_URL`, `process.env.S3CB_ID` and `process.env.S3CB_PASSWORD` are already set and there is no need to rotate a logging file, it can be simplified like this.

```typescript
import S3Logger from "@yingyeothon/logger-s3";

async function main() {
  const { logger, flush } = S3Logger({
    asKey: () => `logging/mylog/all`
  });
  try {
    logger.debug(`Hello`, `World`);
    logger.info(`Info with` /*, Some object can be placed in here. */);
  } catch (error) {
    logger.error(`Error occurred`, error);
  }
  await flush();
}
```

### AWS Lambda Helper

It will append logs to `logging/${systemName}/${yyyyMMdd}`.

```typescript
import { LambdaS3Logger } from "@yingyeothon/logger-s3";

const { logger, flush, updateSystemId } = LambdaS3Logger({
  logKeyPrefix: "logging",

  // Lambda information
  systemName: "HelloWorld",
  lambdaId: "2f40adbe-b450-40fe-9796-cc3d072b4c62",
  handlerName: "testHandler",

  // Logger behavior
  severity: "debug",
  withConsole: false, // Its value is true as default in Lambda logger.

  // S3CB Connection
  apiUrl: "http://localhost:3000/",
  apiId: "test",
  apiPassword: " test"
});

async function main(systemId: string) {
  logger.info("Before having systemId");
  updateSystemId(systemId);
  logger.info("After systemId is set");
  await flush();
}

main("COMPLEX-SYSTEM-ID");
```

This is an example of a JSON serialized log tuple.

```json
{
  "timestamp": "2020-03-15T12:36:38.094Z",
  "level": "info",
  "systemName": "HelloWorld",
  "systemId": "COMPLEX-SYSTEM-ID",
  "handlerName": "testHandler",
  "lambdaId": "2f40adbe-b450-40fe-9796-cc3d072b4c62",
  "args": ["Before having systemId"]
}
{
  "timestamp": "2020-03-15T12:36:38.094Z",
  "level": "info",
  "systemName": "HelloWorld",
  "systemId": "COMPLEX-SYSTEM-ID",
  "handlerName": "testHandler",
  "lambdaId": "2f40adbe-b450-40fe-9796-cc3d072b4c62",
  "args": ["After systemId is set"]
}
```

In this case, `withConsole` is `true` as default. And it writes a log like this.

```text
# TIMESTAMP LEVEL SYSTEM-NAME SYSTEM-ID HANDLER-NAME LAMBDA-ID LOG-ARGS
2020-03-15T13:10:23.344Z INFO HelloWorld null testHandler 2f40adbe-b450-40fe-9796-cc3d072b4c62 Before having systemId
2020-03-15T13:10:23.345Z INFO HelloWorld COMPLEX-SYSTEM-ID testHandler 2f40adbe-b450-40fe-9796-cc3d072b4c62 After systemId is set
```

The first console log doesn't have `systemId` because it is written before`systemId` is set. But the first JSON log have `systemId` because it is flushed after`systemId` is set. The sequence of above example is `logger.info (to console)` -> `updateSystemId` -> `logger.info (to console)` -> `flush (to S3 with JSON via S3CB)`.

## License

MIT
