import { ActivityList } from './activity-list'

import AstNodeList from '../parsers/ast-node-list'

export default function(ASTs: AstNodeList[]): ActivityList {
  const result: ActivityList = []
  for (const AST of ASTs) {
    for (const node of AST) {
      switch (node.type) {
        case 'link_open':
          result.push({
            file: node.file,
            line: node.line,
            nodes: AST.getNodesFor(node),
            type: 'check-link'
          })
          break

        case 'image':
          const nodes = new AstNodeList()
          nodes.push(node)
          result.push({
            file: node.file,
            line: node.line,
            nodes,
            type: 'check-image'
          })
          break
      }
    }
  }
  return result
}
