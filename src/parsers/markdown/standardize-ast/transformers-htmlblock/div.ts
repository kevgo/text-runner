import AbsoluteFilePath from '../../../../domain-model/absolute-file-path'
import pretendToUse from '../../../../helpers/pretend-to-use'
import AstNode from '../../../ast-node'
import AstNodeList from '../../../ast-node-list'
import OpenTagTracker from '../../helpers/open-tag-tracker'
import parseHtmlAttributes from '../../helpers/parse-html-attributes'

const divRegex = /<div([^>]*)>([\s\S]*)<\/div>/m

export default async function transformDiv(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const divMatch = node.content.match(divRegex)
  const resultNode = new AstNode({
    attributes: parseHtmlAttributes(divMatch[1]),
    content: divMatch[2],
    file,
    line,
    tag: 'div',
    type: 'div'
  })
  result.pushNode(resultNode)
  pretendToUse(openTags)
  return result
}
