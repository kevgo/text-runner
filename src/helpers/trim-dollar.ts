// trims the leading dollar from the given command
export default function(text: string): string {
  return text.replace(/^\$?\s*/, '')
}
