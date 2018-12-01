import AbsoluteFilePath from '../../../../domain-model/absolute-file-path'
import pretendToUse from '../../../../helpers/pretend-to-use'
import AstNode from '../../../ast-node'
import AstNodeList from '../../../ast-node-list'
import OpenTagTracker from '../../helpers/open-tag-tracker'
import parseHtmlAttributes from '../../helpers/parse-html-attributes'

const olRegex = /<hr([^>]*)>/

export default async function transformOl(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const match = node.content.match(olRegex)
  const hrNode = new AstNode({
    attributes: parseHtmlAttributes(match[1]),
    content: '',
    file,
    line,
    tag: 'hr',
    type: 'horizontal_row'
  })
  result.pushNode(hrNode)
  pretendToUse(openTags)
  return result
}
