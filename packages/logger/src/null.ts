import ILogger from "./logger";

const nullLogger: ILogger = {
  severity: "none",
  debug: () => 0,
  info: () => 0,
  error: () => 0
};

export default nullLogger;
