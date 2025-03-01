import * as ast from "../ast/index.js"
import { List } from "./index.js"

/** extracts activities that check images and links from the given ActivityLists */
export function extractImagesAndLinks(ASTs: ast.NodeList[]): List {
  const result: List = []
  for (const AST of ASTs) {
    for (const node of AST) {
      switch (node.type) {
        case "image": {
          const nodes = new ast.NodeList()
          nodes.push(node)
          result.push({
            actionName: "check-image",
            document: AST,
            location: node.location,
            region: nodes
          })
          break
        }

        case "link_open":
          result.push({
            actionName: "check-link",
            document: AST,
            location: node.location,
            region: AST.nodesFor(node)
          })
          break
      }
    }
  }
  return result
}
