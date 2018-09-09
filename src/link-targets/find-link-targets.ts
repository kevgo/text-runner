import AstNodeList from '../parsers/ast-node-list.js'
import LinkTargetList from './link-target-list.js'

export default function(nodeLists: AstNodeList[]): LinkTargetList {
  const linkTargetList = new LinkTargetList()
  for (let nodeList of nodeLists) {
    linkTargetList.addNodeList(nodeList)
  }
  return linkTargetList
}
