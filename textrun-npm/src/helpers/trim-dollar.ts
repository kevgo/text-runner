/** trims the leading dollar from the given command */
export function trimDollar(text: string): string {
  return text.replace(/^\$?\s*/, "")
}
