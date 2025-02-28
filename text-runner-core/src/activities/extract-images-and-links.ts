import * as ast from "../ast/index.js"
import { List } from "./index.js"

/** extracts activities that check images and links from the given ActivityLists */
export function extractImagesAndLinks(ASTs: ast.NodeList[]): List {
  const result: List = []
  for (const AST of ASTs) {
    for (const node of AST) {
      switch (node.type) {
        case "link_open":
          result.push({
            actionName: "check-link",
            location: node.location,
            region: AST.nodesFor(node),
            document: AST
          })
          break

        case "image": {
          const nodes = new ast.NodeList()
          nodes.push(node)
          result.push({
            actionName: "check-image",
            location: node.location,
            region: nodes,
            document: AST
          })
          break
        }
      }
    }
  }
  return result
}
