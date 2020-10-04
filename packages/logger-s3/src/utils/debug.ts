export function debugPrint(...args: unknown[]): void {
  if (process.env.DEBUG) {
    console.debug(...args);
  }
}
