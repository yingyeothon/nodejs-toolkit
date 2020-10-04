import { LambdaS3Logger } from "../src";

test("basic-lambda", async () => {
  const { logger, flush, updateSystemId } = LambdaS3Logger({
    // Lambda information
    systemName: "HelloWorld",
    lambdaId: "2f40adbe-b450-40fe-9796-cc3d072b4c62",
    handlerName: "testHandler",
    logKeyPrefix: "logging",

    // Logger behavior
    severity: "debug",
    autoFlushIntervalMillis: 100,
    autoFlushMaxBufferSize: 10,

    // S3CB Connection
    apiUrl: "http://localhost:3000/",
    apiId: "test",
    apiPassword: " test",
  });

  logger.info("Info before systemId is set");
  updateSystemId("COMPLEX-SYSTEM-ID");
  logger.debug("Debug before systemId is set");

  try {
    throw new Error("Something is broken :)");
  } catch (error) {
    logger.error("There is an error", error);
  }

  logger.info("All logs should have systemId properly!");
  await flush();
});
