export function appendAsyncCallback(code: string): string {
  return `${code.trim()};\n__finished();`
}
