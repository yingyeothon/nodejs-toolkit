export interface ILock {
  tryAcquire(actorName: string): Promise<boolean>;
  release(actorName: string): Promise<boolean>;
}

export class InMemoryLock implements ILock {
  private readonly lockHolders = new Set<string>();

  public async tryAcquire(actorName: string) {
    if (this.lockHolders.has(actorName)) {
      return false;
    }
    this.lockHolders.add(actorName);
    return true;
  }

  public async release(actorName: string) {
    return this.lockHolders.delete(actorName);
  }
}
