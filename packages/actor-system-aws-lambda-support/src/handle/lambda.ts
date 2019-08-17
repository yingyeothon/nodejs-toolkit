import { Actor, ActorShifter } from "@yingyeothon/actor-system";
import { ConsoleLogger, ILogger } from "@yingyeothon/logger";
import { Handler } from "aws-lambda";
import { Lambda } from "aws-sdk";
import { IActorLambdaEvent } from "./event";
import { globalTimeline } from "./time";

const defaultLambdaFunctionTimeoutMillis = 14 * 60 * 1000;

interface IActorLambdaHandlerArguments<P> {
  spawn: (event: P) => Actor<any>;
  functionTimeout?: number;
  logger?: ILogger;
}

export const handleActorLambdaEvent = <P = IActorLambdaEvent>({
  spawn,
  functionTimeout = defaultLambdaFunctionTimeoutMillis,
  logger: maybeLogger
}: IActorLambdaHandlerArguments<P>): Handler<P, void> => async event => {
  globalTimeline.reset(functionTimeout);

  const logger = maybeLogger || new ConsoleLogger();
  logger.debug(`actor-lambda`, `handle`, event);

  const actor = spawn(event);
  if (!actor) {
    throw new Error(`No actor [${event}]`);
  }

  await actor.tryToProcess({
    shiftTimeout: globalTimeline.remainMillis
  });

  logger.debug(`actor-lambda`, `end-of-handle`, event);
};

interface IShiftToNextLambdaArguments<P> {
  functionName: string;
  functionVersion?: string;
  buildPayload?: (actorName: string) => P;
}

export const shiftToNextLambda = <P = IActorLambdaEvent>({
  functionName,
  functionVersion,
  buildPayload = actorName => ({ actorName } as any)
}: IShiftToNextLambdaArguments<P>): ActorShifter => ({ name: actorName }) =>
  new Lambda()
    .invoke({
      FunctionName: functionName,
      InvocationType: "Event",
      Qualifier: functionVersion || "$LATEST",
      Payload: JSON.stringify(buildPayload(actorName))
    })
    .promise();
