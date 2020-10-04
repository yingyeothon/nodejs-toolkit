import LogBag from "../model/bag";
export default function aggregate(buffer: Array<{
    key: string;
    body: string;
}>): LogBag;
