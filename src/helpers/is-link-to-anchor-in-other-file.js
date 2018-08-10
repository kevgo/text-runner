// @flow

function isLinkToAnchorInOtherFile (target: string): boolean {
  return !target.startsWith('#') && target.includes('#')
}

module.exports = isLinkToAnchorInOtherFile
