import { Actor, ILogger } from "@yingyeothon/actor-system";
import { APIGatewayProxyEvent } from "aws-lambda";
interface IActorAPIEventHandlerArguments<T> {
    spawn: (apiPath: string, event: APIGatewayProxyEvent) => Actor<T>;
    parseMessage?: (body: string) => T;
    functionTimeout?: number;
    logger?: ILogger;
}
export declare const handleActorAPIEvent: <T>({ spawn, parseMessage: maybeParseMessage, functionTimeout, logger: maybeLogger }: IActorAPIEventHandlerArguments<T>) => import("aws-lambda").Handler<APIGatewayProxyEvent, import("aws-lambda").APIGatewayProxyResult>;
export {};
