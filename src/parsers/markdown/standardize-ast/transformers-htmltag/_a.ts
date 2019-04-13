import { AbsoluteFilePath } from '../../../../domain-model/absolute-file-path'
import { pretendToUse } from '../../../../helpers/pretend-to-use'
import { AstNode } from '../../../ast-node'
import { AstNodeList } from '../../../ast-node-list'
import { OpenTagTracker } from '../../helpers/open-tag-tracker'
import { RemarkableNode } from '../remarkable-node'

export default function transformATag(
  node: RemarkableNode,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const openingTag = openTags.popTag('a', file.platformified(), line)
  const resultNode = new AstNode({
    attributes: openingTag.attributes,
    content: '',
    file,
    line,
    tag: '/a',
    type: openingTag.type.replace('_open', '_close')
  })
  result.pushNode(resultNode)
  pretendToUse(node)
  return result
}
