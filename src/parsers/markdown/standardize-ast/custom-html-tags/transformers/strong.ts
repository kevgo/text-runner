import { AbsoluteFilePath } from '../../../../../domain-model/absolute-file-path'
import { AstNode } from '../../../../ast-node'
import { AstNodeList } from '../../../../ast-node-list'
import { OpenTagTracker } from '../../../helpers/open-tag-tracker'
import { parseHtmlTag } from '../../../helpers/parse-html-tag'
import { RemarkableNode } from '../../remarkable-node'

export default function transformATag(
  node: RemarkableNode,
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
    attributes,
    content: '',
    file,
    line,
    tag,
    type: 'strong_open'
  })
  openTags.add(resultNode)
  result.pushNode(resultNode)
  return result
}
