import ILogWriter from "./writer";
export default function combine(...writers: ILogWriter[]): ILogWriter;
