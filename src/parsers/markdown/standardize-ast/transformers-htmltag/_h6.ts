import AbsoluteFilePath from '../../../../domain-model/absolute-file-path.js'
import AstNode from '../../../ast-node.js'
import AstNodeList from '../../../ast-node-list.js'
import OpenTagTracker from '../../helpers/open-tag-tracker.js'

module.exports = function transformATag(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const openingTag = openTags.popType(
    'heading_open',
    file.platformified(),
    line
  )
  const resultNode = new AstNode({
    type: 'heading_close',
    tag: '/h6',
    file,
    line,
    content: '',
    attributes: openingTag.attributes
  })
  result.pushNode(resultNode)
  return result
}
