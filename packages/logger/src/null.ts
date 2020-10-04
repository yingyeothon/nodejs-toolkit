import Logger from "./logger";

const nullLogger: Logger = {
  severity: "none",
  debug: () => 0,
  info: () => 0,
  error: () => 0,
};

export default nullLogger;
