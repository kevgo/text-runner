import * as ast from "../ast/index.js"
import { List } from "./index.js"
import { normalizeActionName } from "./normalize-action-name.js"

/** returns all activities found in the given ast.NodeLists */
export function extractDynamic(docs: ast.NodeList[], regionMarker: string): List {
  const result: List = []
  for (const doc of docs) {
    result.push(...extractFromAST(doc, regionMarker))
  }
  return result
}

/** returns the activities contained in the given NodeList */
function extractFromAST(doc: ast.NodeList, regionMarker: string): List {
  const result: List = []
  for (const node of doc) {
    if (isActiveBlockTag(node, regionMarker)) {
      result.push({
        actionName: normalizeActionName(node.attributes[regionMarker], node.location),
        location: node.location,
        region: doc.nodesFor(node),
        document: doc
      })
    }
  }
  return result
}

/** returns whether the given AstNode marks an active region in the document */
function isActiveBlockTag(node: ast.Node, activeAttributeName: string): boolean {
  return !!node.attributes[activeAttributeName]
}
