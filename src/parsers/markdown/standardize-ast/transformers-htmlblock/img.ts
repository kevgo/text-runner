import AbsoluteFilePath from '../../../../domain-model/absolute-file-path'
import pretendToUse from '../../../../helpers/pretend-to-use'
import AstNode from '../../../ast-node'
import AstNodeList from '../../../ast-node-list'
import OpenTagTracker from '../../helpers/open-tag-tracker'
import parseHtmlAttributes from '../../helpers/parse-html-attributes'
import removeHtmlComments from '../../helpers/remove-html-comments'

const olRegex = /<img([^>]*)>/

export default async function transformOl(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const match = removeHtmlComments(node.content).match(olRegex)
  if (!match) {
    throw new Error('cannot parse tag')
  }
  const hrNode = new AstNode({
    attributes: parseHtmlAttributes(match[1]),
    content: '',
    file,
    line,
    tag: 'img',
    type: 'image'
  })
  result.pushNode(hrNode)
  pretendToUse(openTags)
  return result
}
