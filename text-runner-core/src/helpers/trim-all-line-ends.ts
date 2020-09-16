/** Removes all whitespace at the end of each line in the given multi-line string */
export function trimAllLineEnds(text: string): string {
  return text.replace(/[ ]+$/gm, "")
}
