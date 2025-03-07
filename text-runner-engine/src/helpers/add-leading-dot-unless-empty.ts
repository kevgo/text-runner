export function addLeadingDotUnlessEmpty(text: string): string {
  if (text === "") {
    return text
  }
  if (text.startsWith(".")) {
    return text
  }
  return "." + text
}
