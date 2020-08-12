/** provides the targets in the given Makefile content, sorted alphabetically */
export function makefileTargets(text: string): string[] {
  return text
    .split("\n")
    .filter((line: string) => line.includes(":"))
    .map((line: string) => line.split(":")[0])
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 0)
    .sort()
}
