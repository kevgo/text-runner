import { AbsoluteFilePath } from '../../../../../domain-model/absolute-file-path'
import { AstNode } from '../../../../ast-node'
import { AstNodeList } from '../../../../ast-node-list'
import { OpenTagTracker } from '../../../helpers/open-tag-tracker'
import { RemarkableNode } from '../../remarkable-node'

export default function(
  node: RemarkableNode,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const resultNode = new AstNode({
    attributes: {},
    content: '',
    file,
    line,
    tag: `h${node.hLevel}`,
    type: node.type
  })
  openTags.add(resultNode)
  result.push(resultNode)
  return result
}