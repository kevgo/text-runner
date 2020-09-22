import { AstNodeList } from "../parsers/standard-AST/ast-node-list"
import { ActivityList } from "./types/activity-list"

/** extracts activities that check images and links from the given ActivityLists */
export function extractImagesAndLinks(ASTs: AstNodeList[]): ActivityList {
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
          const nodes = new AstNodeList()
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
