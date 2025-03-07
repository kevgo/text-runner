export function camelize(text: string): string {
  return text.replace(/^([A-Z])|[\s-_]+(\w)/g, (_match: string, p1: string, p2: string) => {
    if (p2) {
      return p2.toUpperCase()
    } else {
      return p1.toLowerCase()
    }
  })
}
