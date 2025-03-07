import * as ast from "../ast/index.js"
import { List } from "./list.js"

export function find(nodeLists: ast.NodeList[]): List {
  const linkTargetList = new List()
  for (const nodeList of nodeLists) {
    linkTargetList.addNodeList(nodeList)
  }
  return linkTargetList
}
