// @flow

const toSpaceCase = require('to-space-case')

module.exports = function convertToActivityTypeName (blockType: string): string {
  return toSpaceCase(blockType || '')
}
