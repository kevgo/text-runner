export function isLinkToAnchorInSameFile(target: string): boolean {
  return target.startsWith("#")
}
