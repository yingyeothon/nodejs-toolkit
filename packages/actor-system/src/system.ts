import { ConsoleLogger, ILogger } from "@yingyeothon/logger";
import { Actor, IActorProcessOptions } from "./actor";
import { ILock } from "./lock";
import { IQueue } from "./queue";

interface IActorSystemArguments {
  queue: IQueue;
  lock: ILock;
  logger?: ILogger;
}

export class ActorSystem {
  private readonly actors: { [name: string]: Actor<any> } = {};

  private readonly queue: IQueue;
  private readonly lock: ILock;
  private readonly logger: ILogger;

  constructor({ queue, lock, logger }: IActorSystemArguments) {
    this.queue = queue;
    this.lock = lock;
    this.logger = logger || new ConsoleLogger();
  }

  public spawn<T>(
    actorName: string,
    decorateIfAbsent: (newActor: Actor<T>) => Actor<T> = newActor => newActor
  ) {
    const spawned = this.find<T>(actorName);
    if (spawned) {
      this.logger.debug(`actor-system`, `already-spawned`, actorName);
      return spawned;
    }

    this.logger.debug(`actor-system`, `spawn-new-actor`, actorName);
    const actor = new Actor<T>({
      name: actorName,
      queue: this.queue,
      lock: this.lock,
      logger: this.logger
    });

    this.logger.debug(`actor-system`, `post-spawn-msg`, actorName);
    actor.post({
      _control_: "spawn"
    });

    this.logger.debug(`actor-system`, `register-to-actor-map`, actorName);
    this.actors[actorName] = actor;
    return decorateIfAbsent(actor);
  }

  public async despawn<T>(
    actorName: string,
    processOption: IActorProcessOptions = {}
  ) {
    const actor = this.find<T>(actorName);
    if (!actor) {
      this.logger.error(`actor-system`, `no-actor-to-despawn`, actorName);
      return false;
    }

    this.logger.debug(`actor-system`, `post-despawn-msg`, actorName);
    await actor.post({
      _control_: "despawn"
    });
    await actor.tryToProcess(processOption);

    this.logger.debug(`actor-system`, `delete-from-actor-map`, actorName);
    delete this.actors[actorName];
    return true;
  }

  public find<T = any>(actorName: string): Actor<T> | null {
    const actor = this.actors[actorName];
    if (!actor) {
      return null;
    }
    return actor as Actor<T>;
  }
}
