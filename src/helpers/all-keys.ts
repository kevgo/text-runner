// returns all the keys of all objects
export function allKeys(...args: object[]): string[] {
  const result = new Set()
  for (const arg of args) {
    for (const key of Object.keys(arg)) {
      result.add(key)
    }
  }
  return Array.from(result) as string[]
}
