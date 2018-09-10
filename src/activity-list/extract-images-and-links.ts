import { ActivityList } from "./activity-list.js"

import AstNodeList from "../parsers/ast-node-list.js"

export default function(ASTs: AstNodeList[]): ActivityList {
  const result: ActivityList = []
  for (const AST of ASTs) {
    for (let node of AST) {
      switch (node.type) {
        case "link_open":
          result.push({
            type: "check-link",
            file: node.file,
            line: node.line,
            nodes: AST.getNodesFor(node)
          })
          break

        case "image":
          const nodes = new AstNodeList()
          nodes.push(node)
          result.push({
            type: "check-image",
            file: node.file,
            line: node.line,
            nodes
          })
          break
      }
    }
  }
  return result
}
