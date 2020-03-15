import { IS3Logger, S3LoggerEnv } from "./logger";
interface ILambdaInfo {
    systemName?: string;
    systemId?: string;
    handlerName?: string;
    lambdaId?: string;
}
export declare type LambdaS3LoggerEnv = Omit<S3LoggerEnv, "asKey"> & ILambdaInfo & {
    logKeyPrefix?: string;
    asKey?: S3LoggerEnv["asKey"];
};
export interface ILambdaS3Logger extends IS3Logger {
    updateSystemId: (systemId: string) => void;
}
export default function LambdaS3Logger(env: LambdaS3LoggerEnv): ILambdaS3Logger;
export {};
