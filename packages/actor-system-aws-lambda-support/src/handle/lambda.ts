import { Actor, ActorShifter } from "@yingyeothon/actor-system";
import { ConsoleLogger, ILogger } from "@yingyeothon/logger";
import { Handler } from "aws-lambda";
import { Lambda } from "aws-sdk";
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

interface IShiftToNextLambdaArguments {
  functionName: string;
  functionVersion?: string;
}

export const shiftToNextLambda = ({
  functionName,
  functionVersion
}: IShiftToNextLambdaArguments): ActorShifter => ({ name: actorName }) =>
  new Lambda()
    .invoke({
      FunctionName: functionName,
      InvocationType: "Event",
      Qualifier: functionVersion || "$LATEST",
      Payload: JSON.stringify({
        actorName
      } as IActorLambdaEvent)
    })
    .promise();
