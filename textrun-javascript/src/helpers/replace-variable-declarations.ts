/** replaceVariableDeclarations makes variable declarations persist across code regions. */
export function replaceVariableDeclarations(code: string): string {
  return code
    .replace(/\bconst /g, "global.")
    .replace(/\blet /g, "global.")
    .replace(/\bvar /g, "global.")
    .replace(/\bthis\./g, "global.")
}
