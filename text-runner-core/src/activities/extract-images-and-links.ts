import * as ast from "../parsers/standard-AST"
import { ActivityList } from "./index"

/** extracts activities that check images and links from the given ActivityLists */
export function extractImagesAndLinks(ASTs: ast.NodeList[]): ActivityList {
  const result: ActivityList = []
  for (const AST of ASTs) {
    for (const node of AST) {
      switch (node.type) {
        case "link_open":
          result.push({
            actionName: "check-link",
            file: node.file,
            line: node.line,
            region: AST.getNodesFor(node),
            document: AST,
          })
          break

        case "image": {
          const nodes = new ast.NodeList()
          nodes.push(node)
          result.push({
            actionName: "check-image",
            file: node.file,
            line: node.line,
            region: nodes,
            document: AST,
          })
          break
        }
      }
    }
  }
  return result
}
