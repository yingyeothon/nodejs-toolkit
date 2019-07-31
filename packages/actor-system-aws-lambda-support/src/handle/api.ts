import { Actor } from "@yingyeothon/actor-system";
import { ConsoleLogger, ILogger } from "@yingyeothon/logger";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";

const defaultAPIProxyFunctionTimeoutMillis = 6 * 1000;

interface IActorAPIEventHandlerArguments<T> {
  spawn: (apiPath: string, event: APIGatewayProxyEvent) => Actor<T>;
  parseMessage?: (body: string) => T;
  functionTimeout?: number;
  logger?: ILogger;
}

export const handleActorAPIEvent = <T>({
  spawn,
  parseMessage: maybeParseMessage,
  functionTimeout,
  logger: maybeLogger
}: IActorAPIEventHandlerArguments<
  T
>): APIGatewayProxyHandler => async event => {
  const parseMessage =
    maybeParseMessage || ((body: string) => JSON.parse(body) as T);
  const logger = maybeLogger || new ConsoleLogger();

  logger.debug(`actor-api-handler`, `handle`, event.path, event.body);
  const actor = spawn(event.path, event);
  if (!actor) {
    logger.error(`actor-api-handler`, `no-actor`, event);
    throw new Error(`No actor for [${event.path}]`);
  }

  const message = parseMessage(event.body);
  if (!message) {
    logger.error(
      `actor-api-handler`,
      `invalid-message`,
      actor.name,
      event.path,
      event.body
    );
    throw new Error(`Invalid message for actor[${actor.name}]`);
  }

  logger.debug(`actor-api-handler`, `post-and-process`, actor.name, message);
  await actor.post(message);
  await actor.tryToProcess({
    shiftTimeout:
      functionTimeout !== undefined
        ? functionTimeout
        : defaultAPIProxyFunctionTimeoutMillis
  });

  logger.debug(`actor-api-handler`, `end-of-handle`, actor.name);
  return { statusCode: 200, body: "OK" };
};
