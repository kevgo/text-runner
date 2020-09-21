export function camelize(text: string): string {
  // @ts-ignore
  return text.replace(/^([A-Z])|[\s-_]+(\w)/g, function (match, p1, p2) {
    if (p2) {
      return p2.toUpperCase()
    } else {
      return p1.toLowerCase()
    }
  })
}
