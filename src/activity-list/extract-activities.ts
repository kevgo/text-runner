import kebab from "@queso/kebab-case"
import { AstNode } from "../parsers/standard-AST/ast-node"
import { AstNodeList } from "../parsers/standard-AST/ast-node-list"
import { ActivityList } from "./types/activity-list"

/** returns all activities found in the given AstNodeLists */
export function extractActivities(ASTs: AstNodeList[], activeAttributeName: string): ActivityList {
  const result: ActivityList = []
  for (const AST of ASTs) {
    result.push(...extractFromAST(AST, activeAttributeName))
  }
  return result
}

/** returns the activities contained in the given AstNodeList */
function extractFromAST(AST: AstNodeList, attrName: string): ActivityList {
  const result: ActivityList = []
  for (const node of AST) {
    if (isActiveBlockTag(node, attrName)) {
      result.push({
        actionName: kebab(node.attributes[attrName]),
        file: node.file,
        line: node.line,
        nodes: AST.getNodesFor(node)
      })
    }
  }
  return result
}

/** returns whether the given AstNode marks an active region in the document */
function isActiveBlockTag(node: AstNode, activeAttributeName: string): boolean {
  return !!node.attributes[activeAttributeName]
}
