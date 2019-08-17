import { Actor, ActorShifter } from "@yingyeothon/actor-system";
import { ILogger } from "@yingyeothon/logger";
import { Handler } from "aws-lambda";
import { IActorLambdaEvent } from "./event";
interface IActorLambdaHandlerArguments<P> {
    spawn: (event: P) => Actor<any>;
    functionTimeout?: number;
    logger?: ILogger;
}
export declare const handleActorLambdaEvent: <P = IActorLambdaEvent>({ spawn, functionTimeout, logger: maybeLogger }: IActorLambdaHandlerArguments<P>) => Handler<P, void>;
interface IShiftToNextLambdaArguments<P> {
    functionName: string;
    functionVersion?: string;
    buildPayload?: (actorName: string) => P;
}
export declare const shiftToNextLambda: <P = IActorLambdaEvent>({ functionName, functionVersion, buildPayload }: IShiftToNextLambdaArguments<P>) => ActorShifter;
export {};
