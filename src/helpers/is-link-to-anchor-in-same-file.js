// @flow

function isLinkToAnchorInSameFile (target: string): boolean {
  return target.startsWith('#')
}

module.exports = isLinkToAnchorInSameFile
