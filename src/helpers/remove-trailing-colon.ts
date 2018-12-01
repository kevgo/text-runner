export default function removeTrailingColon(text: string): string {
  if (text.endsWith(':')) {
    return text.substring(0, text.length - 1)
  } else {
    return text
  }
}
