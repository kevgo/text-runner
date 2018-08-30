// @flow

function isLinkToAnchorInOtherFile (target: string): boolean {
  return (
    !target.startsWith('#') && !target.includes('://') && target.includes('#')
  )
}

module.exports = isLinkToAnchorInOtherFile
