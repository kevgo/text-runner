export default function isMailtoLink(target: string): boolean {
  return target.startsWith('mailto:')
}
