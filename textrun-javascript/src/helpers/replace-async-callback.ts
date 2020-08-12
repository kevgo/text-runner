export function replaceAsyncCallback(code: string): string {
  return code.replace("<CALLBACK>", "__finished").replace(/\/\/\s*\.\.\./g, "__finished();")
}
