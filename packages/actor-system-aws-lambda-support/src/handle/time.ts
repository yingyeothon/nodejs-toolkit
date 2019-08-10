export class Timeline {
  public epochMillis: number = Date.now();

  public reset() {
    this.epochMillis = Date.now();
  }

  public get passedMillis() {
    return Date.now() - this.epochMillis;
  }
}

export const globalTimeline = new Timeline();
