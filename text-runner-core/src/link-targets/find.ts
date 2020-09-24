import * as ast from "../ast"
import { List } from "./list"

export function find(nodeLists: ast.NodeList[]): List {
  const linkTargetList = new List()
  for (const nodeList of nodeLists) {
    linkTargetList.addNodeList(nodeList)
  }
  return linkTargetList
}
