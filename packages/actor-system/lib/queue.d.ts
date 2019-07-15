export interface IQueue {
    size(actorName: string): Promise<number>;
    push<T>(actorName: string, item: T): Promise<void>;
    pop<T>(actorName: string): Promise<T | null>;
    peek<T>(actorName: string): Promise<T | null>;
}
export declare class InMemoryQueue implements IQueue {
    private readonly queues;
    size(actorName: string): Promise<number>;
    push<T>(actorName: string, item: T): Promise<void>;
    pop<T>(actorName: string): Promise<any>;
    peek<T>(actorName: string): Promise<any>;
}
