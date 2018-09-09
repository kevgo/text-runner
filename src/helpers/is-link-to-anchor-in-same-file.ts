export default function isLinkToAnchorInSameFile(target: string): boolean {
  return target.startsWith('#')
}
