import { ILogger } from "@yingyeothon/logger";
import { Actor, IActorProcessOptions } from "./actor";
import { ILock } from "./lock";
import { IQueue } from "./queue";
interface IActorSystemArguments {
    queue: IQueue;
    lock: ILock;
    logger?: ILogger;
}
export declare class ActorSystem {
    private readonly actors;
    private readonly queue;
    private readonly lock;
    private readonly logger;
    constructor({ queue, lock, logger }: IActorSystemArguments);
    spawn<T>(actorName: string, decorateIfAbsent?: (newActor: Actor<T>) => Actor<T>): Actor<T>;
    despawn<T>(actorName: string, processOption?: IActorProcessOptions): Promise<boolean>;
    find<T = any>(actorName: string): Actor<T> | null;
}
export {};
