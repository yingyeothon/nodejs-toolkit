export interface ILock {
    tryAcquire(actorName: string): Promise<boolean>;
    release(actorName: string): Promise<boolean>;
}
export declare class InMemoryLock implements ILock {
    private readonly lockHolders;
    tryAcquire(actorName: string): Promise<boolean>;
    release(actorName: string): Promise<boolean>;
}
