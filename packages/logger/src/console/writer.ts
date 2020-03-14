import ILogWriter from "../writer";

const consoleWriter: ILogWriter = {
  debug: console.debug,
  info: console.info,
  error: console.error
};

export default consoleWriter;
