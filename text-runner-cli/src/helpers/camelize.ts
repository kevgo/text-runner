export function camelize(text: string): string {
  // @ts-ignore
  return text.replace(/^([A-Z])|[\s-_]+(\w)/g, function (match: string, p1: string, p2: string) {
    if (p2) {
      return p2.toUpperCase()
    } else {
      return p1.toLowerCase()
    }
  })
}
