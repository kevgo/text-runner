export function removeLeadingSlash(text: string): string {
  if (!text.startsWith('/') && !text.startsWith('\\')) {
    return text
  }
  return text.slice(1)
}
