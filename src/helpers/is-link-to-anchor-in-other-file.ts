export default function isLinkToAnchorInOtherFile(target: string): boolean {
  return (
    !target.startsWith('#') && !target.includes('://') && target.includes('#')
  )
}
