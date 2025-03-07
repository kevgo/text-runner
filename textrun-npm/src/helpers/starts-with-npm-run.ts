export function startsWithNpmRun(text: string): boolean {
  return text.startsWith("npm run ")
}
