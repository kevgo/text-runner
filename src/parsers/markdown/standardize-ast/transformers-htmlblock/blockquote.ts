import AbsoluteFilePath from '../../../../domain-model/absolute-file-path'
import pretendToUse from '../../../../helpers/pretend-to-use'
import AstNode from '../../../ast-node'
import AstNodeList from '../../../ast-node-list'
import OpenTagTracker from '../../helpers/open-tag-tracker'
import parseHtmlAttributes from '../../helpers/parse-html-attributes'

const blockquoteRegex = /<blockquote([^>]*)>([\s\S]*)<\/blockquote>/m

export default async function transformBlockquote(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const blockquoteMatch = node.content.match(blockquoteRegex)
  const resultNode = new AstNode({
    attributes: parseHtmlAttributes(blockquoteMatch[1]),
    content: blockquoteMatch[2],
    file,
    line,
    tag: 'blockquote',
    type: 'blockquote'
  })
  result.pushNode(resultNode)
  pretendToUse(openTags)
  return result
}
