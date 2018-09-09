import AbsoluteFilePath from '../../../../domain-model/absolute-file-path.js'
import AstNode from '../../../ast-node.js'
import AstNodeList from '../../../ast-node-list.js'
import parseHtmlAttributes from '../../helpers/parse-html-attributes.js'
import OpenTagTracker from '../../helpers/open-tag-tracker.js'
import UnprintedUserError from '../../../../errors/unprinted-user-error.js'

const preRegex = /<pre([^>]*)>([\s\S]*)<\/pre>/m

module.exports = async function transformPre(
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const match = node.content.match(preRegex)
  if (!match) {
    throw new UnprintedUserError(
      'cannot match <pre> tag',
      file.platformified(),
      line
    )
  }
  const resultNode = new AstNode({
    type: 'fence',
    tag: 'pre',
    file,
    line,
    content: match[2],
    attributes: parseHtmlAttributes(match[1])
  })
  result.pushNode(resultNode)
  return result
}
