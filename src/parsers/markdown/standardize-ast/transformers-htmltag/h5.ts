import AbsoluteFilePath from '../../../../domain-model/absolute-file-path.js'
import AstNode from '../../../ast-node.js'
import AstNodeList from '../../../ast-node-list.js'
import OpenTagTracker from '../../helpers/open-tag-tracker.js'
import parseHtmlTag from '../../helpers/parse-html-tag.js'

module.exports = function transformATag(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const [tag, attributes] = parseHtmlTag(
    node.content,
    file.platformified(),
    line
  )
  const resultNode = new AstNode({
    type: 'heading_open',
    tag,
    file,
    line,
    content: '',
    attributes
  })
  openTags.add(resultNode)
  result.pushNode(resultNode)
  return result
}
