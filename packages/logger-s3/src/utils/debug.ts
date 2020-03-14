export function debugPrint(...args: any[]) {
  if (process.env.DEBUG) {
    console.debug(...args);
  }
}
