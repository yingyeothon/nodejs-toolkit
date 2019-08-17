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
    beforeAct: IActorEvent;
    afterAct: IActorEvent;
    shift: IActorEvent;
}
export declare type ActorShifter = (event: IActorEvent) => any | Promise<any>;
export interface IActorProcessOptions {
    shiftTimeout?: number;
}
interface IActorArguments {
    name: string;
    queue: IQueue;
    lock: ILock;
    logger: ILogger;
}
declare const controlKey = "_control_";
interface IActorControlMessage {
    [controlKey]: "spawn" | "despawn" | "beforeAct" | "afterAct";
}
export declare class Actor<T> extends EventBroker<IActorEventMap<T>> {
    readonly name: string;
    private readonly queue;
    private readonly lock;
    private readonly logger;
    constructor({ name, queue, lock, logger }: IActorArguments);
    post(item: T | IActorControlMessage): Promise<void>;
    tryToProcess({ shiftTimeout }?: IActorProcessOptions): Promise<void>;
    send(item: T, options?: IActorProcessOptions): Promise<void>;
    private consumeLoop;
    private consumeQueueInLock;
    private processMessage;
    private processControlMessage;
    private processUserMessage;
}
export {};
