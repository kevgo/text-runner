// @flow

const toSpaceCase = require('to-space-case')

module.exports = function convertIntoActivityTypeName (blockType): string {
  return toSpaceCase(blockType || '')
}
