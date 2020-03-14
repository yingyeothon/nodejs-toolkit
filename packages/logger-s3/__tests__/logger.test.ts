import LogSeverity from "@yingyeothon/logger/lib/severity";
import S3Logger from "../src";

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

test("basic-scenario", async () => {
  const { logger, flush } = S3Logger({
    apiUrl: "http://localhost:3000/",
    apiId: "test",
    apiPassword: " test",
    asKey: buildLogFileName,
    autoFlushIntervalMillis: 100,
    autoFlushMaxBufferSize: 10,
    severity: "debug",
    // serializer: (timestamp, level, args) =>
    //   [timestamp.getTime(), level, ...args].join(" ") + "\n",
    withConsole: true
  });

  for (let i = 0; i < 10; ++i) {
    logger.debug("Hello from DEBUG", i);
    logger.info("Hello from INFO", i);
    logger.error("Bye from ERROR", i);
  }
  await flush();

  logger.error("Step B", "Bye, once more!");
  await flush();
  await flush();
  await flush();

  logger.debug("Step C", "Hi");
  logger.info("Step C", "Hello");
  logger.error("Step C", "Bye");

  try {
    throw new Error("Oops!");
  } catch (error) {
    logger.error("Error!", error);
  }

  await new Promise<void>(resolve => setTimeout(resolve, 200));
  logger.error("Finish", "FlushALL");

  await flush();
});
