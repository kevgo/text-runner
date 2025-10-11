export function isExternalLink(target: string): boolean {
  if (target.startsWith("//")) {
    return true
  }
  try {
    const parsedUrl = new URL(target)
    return !!parsedUrl.protocol
  } catch {
    // If URL constructor throws, it's not a valid absolute URL
    return false
  }
}
