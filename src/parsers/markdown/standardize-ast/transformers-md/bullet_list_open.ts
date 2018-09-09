import AbsoluteFilePath from '../../../../domain-model/absolute-file-path.js'
import AstNode from '../../../ast-node.js'
import AstNodeList from '../../../ast-node-list.js'
import OpenTagTracker from '../../helpers/open-tag-tracker.js'

export default function(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const resultNode = new AstNode({
    type: node.type,
    tag: 'ul',
    file,
    line,
    content: '',
    attributes: {}
  })
  openTags.add(resultNode)
  result.pushNode(resultNode)
  return result
}
