import AbsoluteFilePath from '../../../../domain-model/absolute-file-path.js'
import AstNode from '../../../ast-node.js'
import AstNodeList from '../../../ast-node-list.js'
import parseHtmlAttributes from '../../helpers/parse-html-attributes.js'
import OpenTagTracker from '../../helpers/open-tag-tracker.js'

const blockquoteRegex = /<blockquote([^>]*)>([\s\S]*)<\/blockquote>/m

module.exports = async function transformBlockquote(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const blockquoteMatch = node.content.match(blockquoteRegex)
  const resultNode = new AstNode({
    type: 'blockquote',
    tag: 'blockquote',
    file,
    line,
    content: blockquoteMatch[2],
    attributes: parseHtmlAttributes(blockquoteMatch[1])
  })
  result.pushNode(resultNode)
  return result
}
