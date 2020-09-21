/** allKeys returns all the keys of all objects. */
export function allKeys(...args: Record<string, string>[]): string[] {
  const result = new Set<string>()
  for (const arg of args) {
    for (const key of Object.keys(arg)) {
      result.add(key)
    }
  }
  return Array.from(result)
}
