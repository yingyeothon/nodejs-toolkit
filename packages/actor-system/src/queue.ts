export interface IQueue {
  size(actorName: string): Promise<number>;
  push<T>(actorName: string, item: T): Promise<void>;
  pop<T>(actorName: string): Promise<T | null>;
  peek<T>(actorName: string): Promise<T | null>;
}

export class InMemoryQueue implements IQueue {
  private readonly queues: {
    [actorName: string]: any[];
  } = {};

  public async size(actorName: string) {
    return this.queues[actorName] ? this.queues[actorName].length : 0;
  }

  public async push<T>(actorName: string, item: T) {
    if (!this.queues[actorName]) {
      this.queues[actorName] = [];
    }
    this.queues[actorName].push(item);
  }

  public async pop<T>(actorName: string) {
    if (!this.queues[actorName] || this.queues[actorName].length === 0) {
      return null;
    }
    return this.queues[actorName].shift();
  }

  public async peek<T>(actorName: string) {
    if (!this.queues[actorName] || this.queues[actorName].length === 0) {
      return null;
    }
    return this.queues[actorName][0];
  }
}
