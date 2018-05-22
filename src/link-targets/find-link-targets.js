// @flow

const AstNodeList = require('../parsers/ast-node-list.js')
const LinkTargetList = require('./link-target-list.js')

module.exports = function (nodeLists: AstNodeList[]): LinkTargetList {
  const linkTargetList = new LinkTargetList()
  for (let nodeList of nodeLists) {
    linkTargetList.addNodeList(nodeList)
  }
  return linkTargetList
}
