import AstNodeList from '../parsers/ast-node-list'
import LinkTargetList from './link-target-list'

export default function(nodeLists: AstNodeList[]): LinkTargetList {
  const linkTargetList = new LinkTargetList()
  for (const nodeList of nodeLists) {
    linkTargetList.addNodeList(nodeList)
  }
  return linkTargetList
}
