import { FilteredLogger } from "../src";
import { ILogger } from "..";

test("filtered", () => {
  const buffer: string[] = [];
  const logger: ILogger = new FilteredLogger("info", {
    debug: (...args: unknown[]) => buffer.push("debug " + args.join(" ")),
    info: (...args: unknown[]) => buffer.push("info " + args.join(" ")),
    error: (...args: unknown[]) => buffer.push("error " + args.join(" ")),
  });

  logger.debug("hi");
  logger.info("hello");
  logger.error("bye");

  expect(buffer.join(" ")).toEqual("info hello error bye");

  logger.severity = "debug";

  logger.debug("again");
  logger.info("say");
  logger.error("what");

  expect(buffer.join(" ")).toEqual(
    "info hello error bye debug again info say error what"
  );
});
