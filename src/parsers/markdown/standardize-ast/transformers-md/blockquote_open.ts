import AbsoluteFilePath from '../../../../domain-model/absolute-file-path'
import AstNode from '../../../ast-node'
import AstNodeList from '../../../ast-node-list'
import OpenTagTracker from '../../helpers/open-tag-tracker'
import parseHtmlAttributes from '../../helpers/parse-html-attributes'

const blockquoteRegex = /<blockquote([^>]*)>([\s\S]*)<\/blockquote>/m

export default function(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  let attributes = {}
  if (node.content) {
    const match = node.content.match(blockquoteRegex)
    if (!match) {
      throw new Error(`cannot parse blockquote content: ${node.content}`)
    }
    attributes = parseHtmlAttributes(match[1])
  }
  const resultNode = new AstNode({
    attributes,
    content: '',
    file,
    line,
    tag: 'blockquote',
    type: node.type
  })
  openTags.add(resultNode)
  result.pushNode(resultNode)
  return result
}
