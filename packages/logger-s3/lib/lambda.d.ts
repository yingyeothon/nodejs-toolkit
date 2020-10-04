import { S3Logger, S3LoggerEnv } from "./logger";
interface LambdaInfo {
    systemName?: string;
    systemId?: string;
    handlerName?: string;
    lambdaId?: string;
}
export declare type LambdaS3LoggerEnv = Omit<S3LoggerEnv, "asKey"> & LambdaInfo & {
    logKeyPrefix?: string;
    asKey?: S3LoggerEnv["asKey"];
};
export interface ILambdaS3Logger extends S3Logger {
    updateSystemId: (systemId: string) => void;
}
export default function LambdaS3Logger(env: LambdaS3LoggerEnv): ILambdaS3Logger;
export {};
