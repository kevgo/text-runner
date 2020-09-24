import * as ast from "../ast"
import { LinkTargetList } from "./link-target-list"

export function findLinkTargets(nodeLists: ast.NodeList[]): LinkTargetList {
  const linkTargetList = new LinkTargetList()
  for (const nodeList of nodeLists) {
    linkTargetList.addNodeList(nodeList)
  }
  return linkTargetList
}
