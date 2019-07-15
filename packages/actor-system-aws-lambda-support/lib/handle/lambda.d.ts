import { Actor, ILogger } from "@yingyeothon/actor-system";
import { Handler } from "aws-lambda";
import { IActorLambdaEvent } from "./event";
interface IActorLambdaHandlerArguments {
    spawn: (actorName: string) => Actor<any>;
    functionTimeout?: number;
    logger?: ILogger;
}
export declare const handleActorLambdaEvent: ({ spawn, functionTimeout, logger: maybeLogger }: IActorLambdaHandlerArguments) => Handler<IActorLambdaEvent, void>;
export {};
