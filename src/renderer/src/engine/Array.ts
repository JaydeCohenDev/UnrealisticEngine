export function ArrayContains<T>(array: T[], item: T): boolean {
  for (let element of array) {
    if (item === element) return true;
  }

  return false;
}
