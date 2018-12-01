export default function(text: string): string {
  if (text.endsWith('/')) {
    return text
  }
  return text + '/'
}
