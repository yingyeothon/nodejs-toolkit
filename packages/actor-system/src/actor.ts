import { EventBroker } from "@yingyeothon/event-broker";
import { ILogger } from "@yingyeothon/logger";
import { ILock } from "./lock";
import { IQueue } from "./queue";

interface IActorEvent {
  name: string;
}

interface IActorActionEvent<T> extends IActorEvent {
  message: T;
}

interface IActorEventMap<T> {
  act: IActorActionEvent<T>;
  error: Error;

  spawn: IActorEvent;
  despawn: IActorEvent;
  shift: IActorEvent;
}

export type ActorShifter = (event: IActorEvent) => any | Promise<any>;

export interface IActorProcessOptions {
  /**
   * If an actor runs on a container that has a limitation of lifetime
   * such as AWS Lambda, it should shift to a new actor to process all messages
   * properly from the situation that kills a container by its hypervisor.
   *
   * An actor can have a limited lifetime via this parameter, and when it has
   * been reached it occurs `shift` event to its observers to give a shift chance.
   */
  shiftTimeout?: number;
}

interface IActorArguments {
  name: string;
  queue: IQueue;
  lock: ILock;
  logger: ILogger;
}

const controlKey = "_control_";

interface IActorControlMessage {
  [controlKey]: "spawn" | "despawn";
}

export class Actor<T> extends EventBroker<IActorEventMap<T>> {
  public readonly name: string;
  private readonly queue: IQueue;
  private readonly lock: ILock;
  private readonly logger: ILogger;

  constructor({ name, queue, lock, logger }: IActorArguments) {
    super();
    this.name = name;
    this.queue = queue;
    this.lock = lock;
    this.logger = logger;
  }

  public async post(item: T | IActorControlMessage) {
    await this.queue.push(this.name, item);
    this.logger.debug(`actor`, `push`, item);
  }

  public async tryToProcess({ shiftTimeout }: IActorProcessOptions = {}) {
    const startMillis = Date.now();
    const isAlive = () =>
      shiftTimeout > 0 ? Date.now() - startMillis < shiftTimeout : true;

    await this.consumeLoop(isAlive);
  }

  /**
   * `post` + `tryToProcess`.
   * @param item
   * @param options
   */
  public async send(item: T, options: IActorProcessOptions = {}) {
    await this.post(item);
    await this.tryToProcess(options);
  }

  private async consumeLoop(isAlive: () => boolean) {
    const { name, queue, lock } = this;

    this.logger.debug(`actor`, `consume-loop`, name);
    while (true) {
      // Do nothing if cannot get the lock.
      this.logger.debug(`actor`, `try-to-lock`, name);
      if (!(await lock.tryAcquire(name))) {
        this.logger.debug(`actor`, `cannot-lock`, name);
        break;
      }

      // Consume messages in the queue if locked.
      await this.consumeQueueInLock(isAlive);

      // Whatever its reason, release the lock.
      this.logger.debug(`actor`, `release-lock`, name);
      await lock.release(name);

      // There is no messages in the queue after unlocked,
      // We can get off from it.
      if ((await queue.size(name)) === 0) {
        this.logger.debug(`actor`, `empty-queue`, name);
        break;
      }

      // Or, shift to new actor when a container has been timeout.
      if (!isAlive()) {
        this.logger.debug(`actor`, `shift-timeout`, name);
        await maybeAwait(this.fire("shift", { name }));
        break;
      }

      // Otherwise, we must keep go on
      // because there is another message and it is alive.
    }
  }

  private async consumeQueueInLock(isAlive: () => boolean) {
    const { queue, name } = this;

    this.logger.debug(`actor`, `consume-queue`, name);

    // Process messages as possible as it can while alive.
    while (isAlive() && (await queue.size(name)) > 0) {
      // Step 1. Peek a message from the queue to process it.
      const message = await queue.peek<T | IActorControlMessage>(name);
      this.logger.debug(`actor`, `get-message`, name, message);

      // Step 1-1. We should stop to process when the queue is broken.
      if (!message) {
        this.logger.debug(`actor`, `invalid-message`, name, message);
        break;
      }

      // Step 2. Process a message by its type.
      await this.processMessage(message);

      // Step 3. Delete a message from the queue.
      // It will help to preserve the order of messages from broken handlers.
      await queue.pop(name);
      this.logger.debug(`actor`, `delete-message`, name);
    }
  }

  private async processMessage(message: T | IActorControlMessage) {
    this.logger.debug(`actor`, `process-message`, this.name, message);
    try {
      if ((message as any)[controlKey]) {
        await this.processControlMessage(message as IActorControlMessage);
      } else {
        await this.processUserMessage(message as T);
      }
    } catch (error) {
      this.logger.error(
        `actor`,
        `process-message-error`,
        this.name,
        message,
        error
      );
      await maybeAwait(this.fire("error", error));
    }
  }

  private async processControlMessage(message: IActorControlMessage) {
    const { name } = this;
    this.logger.debug(`actor`, `process-control-message`, name, message);
    switch (message[controlKey]) {
      case "spawn":
        await maybeAwait(this.fire("spawn", { name }));
        break;
      case "despawn":
        await maybeAwait(this.fire("despawn", { name }));
        break;
    }
  }

  private async processUserMessage(message: T) {
    const { name } = this;
    this.logger.debug(`actor`, `process-user-message`, name, message);
    await maybeAwait(this.fire("act", { name, message }));
  }
}

const maybeAwait = async (maybePromise: any | Promise<any>) => {
  if (maybePromise && maybePromise instanceof Promise) {
    await maybePromise;
  }
};
