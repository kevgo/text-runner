const re = /\\/g

/** Converts the given Windows path into a Unix path */
export function unixify(text: string): string {
  return text.replace(re, "/")
}
