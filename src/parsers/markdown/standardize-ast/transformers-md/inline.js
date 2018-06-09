// @flow

const AstNodeList = require('../../../ast-node-list.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

module.exports = function (
  node: Object,
  openTags: OpenTagTracker,
  filepath: string,
  line: number
): AstNodeList {
  return new AstNodeList()
}
