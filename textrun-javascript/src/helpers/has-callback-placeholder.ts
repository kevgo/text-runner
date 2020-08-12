/** hasCallbackPlaceholder returns whether the given code block contains a callback placeholder. */
export function hasCallbackPlaceholder(code: string): boolean {
  return code.includes("<CALLBACK>") || code.includes("// ...")
}
