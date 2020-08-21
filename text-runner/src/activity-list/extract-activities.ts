import { AstNode } from "../parsers/standard-AST/ast-node"
import { AstNodeList } from "../parsers/standard-AST/ast-node-list"
import { ActivityList } from "./types/activity-list"
import { normalizeActionName } from "./normalize-action-name"

/** returns all activities found in the given AstNodeLists */
export function extractActivities(docs: AstNodeList[], regionMarker: string): ActivityList {
  const result: ActivityList = []
  for (const doc of docs) {
    result.push(...extractFromAST(doc, regionMarker))
  }
  return result
}

/** returns the activities contained in the given AstNodeList */
function extractFromAST(doc: AstNodeList, regionMarker: string): ActivityList {
  const result: ActivityList = []
  for (const node of doc) {
    if (isActiveBlockTag(node, regionMarker)) {
      result.push({
        actionName: normalizeActionName(node.attributes[regionMarker]),
        file: node.file,
        line: node.line,
        region: doc.getNodesFor(node),
        document: doc,
      })
    }
  }
  return result
}

/** returns whether the given AstNode marks an active region in the document */
function isActiveBlockTag(node: AstNode, activeAttributeName: string): boolean {
  return !!node.attributes[activeAttributeName]
}
