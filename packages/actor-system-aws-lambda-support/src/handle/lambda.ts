import { Actor, ConsoleLogger, ILogger } from "@yingyeothon/actor-system";
import { Handler } from "aws-lambda";
import { IActorLambdaEvent } from "./event";

const defaultLambdaFunctionTimeoutMillis = 14 * 60 * 1000;

interface IActorLambdaHandlerArguments {
  spawn: (actorName: string) => Actor<any>;
  functionTimeout?: number;
  logger?: ILogger;
}

export const handleActorLambdaEvent = ({
  spawn,
  functionTimeout,
  logger: maybeLogger
}: IActorLambdaHandlerArguments): Handler<
  IActorLambdaEvent,
  void
> => async event => {
  const logger = maybeLogger || new ConsoleLogger();
  logger.debug(`actor-lambda`, `handle`, event.actorName);

  const actor = spawn(event.actorName);
  if (!actor) {
    throw new Error(`No actor [${event.actorName}]`);
  }

  await actor.tryToProcess({
    shiftTimeout:
      functionTimeout !== undefined
        ? functionTimeout
        : defaultLambdaFunctionTimeoutMillis
  });

  logger.debug(`actor-lambda`, `end-of-handle`, event.actorName);
};
