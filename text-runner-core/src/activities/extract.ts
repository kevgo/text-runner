import * as ast from "../ast"
import { ActivityList } from "./index"
import { normalizeActionName } from "./normalize-action-name"

/** returns all activities found in the given ast.NodeLists */
export function extract(docs: ast.NodeList[], regionMarker: string): ActivityList {
  const result: ActivityList = []
  for (const doc of docs) {
    result.push(...extractFromAST(doc, regionMarker))
  }
  return result
}

/** returns the activities contained in the given NodeList */
function extractFromAST(doc: ast.NodeList, regionMarker: string): ActivityList {
  const result: ActivityList = []
  for (const node of doc) {
    if (isActiveBlockTag(node, regionMarker)) {
      result.push({
        actionName: normalizeActionName(node.attributes[regionMarker], node.file, node.line),
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
function isActiveBlockTag(node: ast.Node, activeAttributeName: string): boolean {
  return !!node.attributes[activeAttributeName]
}
