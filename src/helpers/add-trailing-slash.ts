export function addTrailingSlash(text: string): string {
  if (text.endsWith("/")) {
    return text
  }
  return text + "/"
}
