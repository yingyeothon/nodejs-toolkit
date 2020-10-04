import LogWriter from "../writer";

const consoleWriter: LogWriter = {
  debug: console.debug,
  info: console.info,
  error: console.error,
};

export default consoleWriter;
